'use client';

import Image from 'next/image';
import cx from 'classnames';
import { animate, clamp } from 'motion/react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import vertexShader from './shaders/vertex';
import fragmentShader from './shaders/fragment';
import {
  defaultStickerSettings,
  STICKER_REPLAY_EVENT,
  type StickerSettings,
} from './settings';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

// Room (px) around the image for the lifted paper and its cast shadow,
// so the curl is never clipped by the canvas edges.
const CANVAS_PADDING = 120;
// Canvases are large (image + padding): beyond 1.5x the extra pixels cost a
// lot of fill rate for no visible gain on a flat, mostly static sticker.
const MAX_PIXEL_RATIO = 1.5;
const REVEAL_EASE = [0.65, 0, 0.35, 1] as const;

interface StickerImageProps {
  // Image, or the poster frame when videoSrc is set.
  src: string;
  // Plays (muted, looped) as the sticker's texture instead of the image.
  videoSrc?: string;
  alt: string;
  width: number;
  height: number;
  // Colour shown on the back of the paper when it curls over.
  backColor: string;
  sizes?: string;
  // Above-the-fold stickers: fetch the image first so the reveal can start
  // right away instead of waiting on a lazy load.
  eager?: boolean;
  // false: no unroll on enter, and the DOM image stays visible until the
  // canvas takes over — used where the sticker arrives through a view
  // transition, which needs something painted to morph into.
  reveal?: boolean;
  className?: string;
  settings?: StickerSettings;
}

export default function StickerImage({
  src,
  videoSrc,
  alt,
  width,
  height,
  backColor,
  sizes = '100vw',
  eager = false,
  reveal: shouldReveal = true,
  className,
  settings = defaultStickerSettings,
}: StickerImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Read on every frame, so tweaking the (mutable) settings object from the
  // lab GUI applies live without re-creating the WebGL scene.
  const settingsRef = useRef(settings);
  const backColorRef = useRef(backColor);
  useEffect(() => {
    settingsRef.current = settings;
    backColorRef.current = backColor;
  }, [settings, backColor]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    const video = videoRef.current;
    const canvasHost = canvasHostRef.current;
    if (
      prefersReducedMotion !== false ||
      !wrapper ||
      !(image || video) ||
      !canvasHost
    )
      return;

    video?.play().catch(() => {});

    // A fresh canvas per mount: the cleanup force-loses its GL context, so a
    // remount (StrictMode, HMR) must never reuse it.
    const canvas = document.createElement('canvas');
    canvas.className = 'block size-full';
    canvasHost.append(canvas);

    /** Renderer */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        // Edges are already smoothed in the shader (rounded-box SDF); MSAA on
        // canvases this size was a big part of the per-frame cost.
        antialias: false,
      });
    } catch {
      // No WebGL (or too many contexts): show the plain DOM image instead.
      canvas.remove();
      wrapper.dataset.fallback = 'true';
      return () => {
        delete wrapper.dataset.fallback;
      };
    }
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      settingsRef.current.perspective,
      1,
      1,
      20000,
    );

    /** Materials */
    let texture = new THREE.Texture();

    const uniforms = {
      uTexture: { value: texture },
      uImageSize: { value: new THREE.Vector2(1, 1) },
      uSize: { value: new THREE.Vector2(1, 1) },
      uPeelTop: { value: 0 },
      uPeelBottom: { value: 0 },
      uRadius: { value: 0 },
      uTilt: { value: 0 },
      uLayerGap: { value: 0 },
      uBackColor: { value: new THREE.Color(backColorRef.current) },
      uCorner: { value: 0 },
      uShade: { value: 0 },
      uOpacity: { value: 0 },
      uIsShadow: { value: 0 },
      uShadowOffset: { value: new THREE.Vector2() },
      uShadowLift: { value: 0 },
      uShadowOpacity: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
    // Same uniform objects (shared by reference), only the pass flag differs.
    const shadowMaterial = new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uIsShadow: { value: 1 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    /** Meshes */
    let geometry = new THREE.PlaneGeometry(1, 1);
    const shadow = new THREE.Mesh(geometry, shadowMaterial);
    const sticker = new THREE.Mesh(geometry, material);
    shadow.renderOrder = 0;
    sticker.renderOrder = 1;
    scene.add(shadow, sticker);

    /** Rendering on demand: a resting sticker costs nothing per frame */
    let needsRender = true;

    /** Sizing: 1 world unit = 1 CSS px on the z = 0 plane */
    const updateCamera = () => {
      const canvasWidth = wrapper.offsetWidth + CANVAS_PADDING * 2;
      const canvasHeight = wrapper.offsetHeight + CANVAS_PADDING * 2;
      camera.fov = settingsRef.current.perspective;
      camera.aspect = canvasWidth / canvasHeight;
      camera.position.z =
        canvasHeight / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.updateProjectionMatrix();
    };

    const resize = () => {
      const { offsetWidth: w, offsetHeight: h } = wrapper;
      renderer.setSize(w + CANVAS_PADDING * 2, h + CANVAS_PADDING * 2, false);
      updateCamera();

      geometry.dispose();
      // Dense along y (where the curl bends), lighter along x (tilt only).
      geometry = new THREE.PlaneGeometry(w, h, 24, 160);
      sticker.geometry = geometry;
      shadow.geometry = geometry;
      uniforms.uSize.value.set(w, h);
      needsRender = true;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    // Shader programs compile in the background (KHR_parallel_shader_compile)
    // instead of blocking the first frame of the reveal.
    const compiled = renderer.compileAsync(scene, camera).catch(() => {});

    /** Texture: reuse the DOM image (already optimised by next/image) */
    let isTextureReady = false;
    let isDisposed = false;
    const onImageLoad = async () => {
      if (!image?.naturalWidth) return;
      // Uploading the <img> element directly lets three size the texture
      // from its *CSS* width while the pixels come at their natural size,
      // which overflows the texture and renders black. A bitmap has one
      // unambiguous size (and is flipped here, as bitmaps ignore flipY).
      // Decoded at the size actually drawn, not the full file (up to 2560px):
      // a smaller upload is what makes the first unroll smooth.
      const drawnWidth = Math.ceil(wrapper.offsetWidth * pixelRatio);
      const options: ImageBitmapOptions = {
        imageOrientation: 'flipY',
        ...(drawnWidth > 0 &&
          drawnWidth < image.naturalWidth && {
            resizeWidth: drawnWidth,
            resizeQuality: 'high',
          }),
      };
      // From a Blob (the file is already in the HTTP cache), decoding and
      // resizing run off the main thread; from the <img> element they ran
      // synchronously (~90ms hitch on a slow CPU, right as it scrolled in).
      const source = await fetch(image.currentSrc || image.src)
        .then((response) => response.blob())
        .catch(() => image);
      const bitmap = await createImageBitmap(source, options);
      await compiled;
      if (isDisposed) return bitmap.close();

      // A fresh texture per load: WebGL storage is immutable once
      // allocated, and next/image may swap to a bigger srcset candidate.
      (texture.image as ImageBitmap | null)?.close?.();
      texture.dispose();
      texture = new THREE.Texture(bitmap);
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      uniforms.uTexture.value = texture;
      uniforms.uImageSize.value.set(bitmap.width, bitmap.height);
      // Upload now, while still rolled up, rather than on a reveal frame.
      renderer.initTexture(texture);
      isTextureReady = true;
      needsRender = true;
      maybeReveal();
    };
    // ...or the playing video, re-sampled by three on every new frame.
    const onVideoData = () => {
      if (!video || isTextureReady) return;
      texture.dispose();
      texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTexture.value = texture;
      uniforms.uImageSize.value.set(video.videoWidth, video.videoHeight);
      isTextureReady = true;
      needsRender = true;
      maybeReveal();
    };

    /** Reveal: the sticker unrolls from the top down onto the page */
    const reveal = { progress: shouldReveal ? 0 : 1 };
    let isInView = false;
    let hasRevealed = !shouldReveal;
    let revealAnimation: ReturnType<typeof animate> | undefined;
    const playReveal = () => {
      revealAnimation?.stop();
      reveal.progress = 0;
      revealAnimation = animate(0, 1, {
        duration: settingsRef.current.revealDuration,
        ease: REVEAL_EASE,
        onUpdate: (value) => {
          reveal.progress = value;
        },
      });
    };
    // Only once the texture is on the GPU: starting on mere visibility let
    // the animation play out unseen while the image was still loading.
    const maybeReveal = () => {
      if (hasRevealed || !isInView || !isTextureReady) return;
      hasRevealed = true;
      playReveal();
    };

    // Bound after maybeReveal exists: an already-loaded source fires now.
    if (video) {
      if (video.readyState >= 2) onVideoData();
      video.addEventListener('loadeddata', onVideoData);
    } else if (image) {
      if (image.complete) onImageLoad();
      // Not 'once': next/image may swap to a bigger srcset candidate later.
      image.addEventListener('load', onImageLoad);
    }

    /** Loop */
    // Lab GUI edits mutate the settings object: compare a snapshot per frame.
    let lastSettingsKey = '';
    let wasMoving = false;
    let frameId = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let peel = 0;

    const tick = (now: number) => {
      const s = settingsRef.current;
      const dt = Math.max(now - lastTime, 1) / 1000;
      lastTime = now;

      // Measured from window.scrollY rather than Lenis' velocity, so the
      // peel also follows native touch scrolling (Lenis has syncTouch off).
      const scrollY = window.scrollY;
      const velocity = (scrollY - lastScrollY) / dt;
      lastScrollY = scrollY;

      const target = s.manualPeel
        ? s.manualPeelValue
        : clamp(-1, 1, velocity / s.fullPeelSpeed);
      // Frame-rate independent easing towards the target peel.
      peel += (target - peel) * (1 - Math.pow(1 - s.damping, dt * 60));

      const { x: w, y: h } = uniforms.uSize.value;
      const edgeSign = s.peelEdge === 'trailing' ? -1 : 1;
      const signedPeel = peel * edgeSign;
      const maxPeelPx = s.maxPeel * h;
      // Enough length to roll the whole sheet, tilted span included.
      const revealPeelPx = (1 - reveal.progress) * (h + Math.abs(s.tilt) * w);

      uniforms.uPeelTop.value = Math.max(signedPeel, 0) * maxPeelPx;
      uniforms.uPeelBottom.value =
        Math.max(-signedPeel, 0) * maxPeelPx + revealPeelPx;
      uniforms.uOpacity.value = clamp(0, 1, reveal.progress / 0.15);
      uniforms.uRadius.value = s.radius;
      uniforms.uTilt.value = s.tilt;
      uniforms.uLayerGap.value = s.layerGap;
      uniforms.uShade.value = s.shade;
      uniforms.uCorner.value = s.corner;
      uniforms.uShadowOpacity.value = s.shadowOpacity;
      uniforms.uShadowLift.value = s.shadowLift;
      uniforms.uShadowOffset.value.set(s.shadowOffset, -s.shadowOffset);
      uniforms.uBackColor.value.set(backColorRef.current);
      if (camera.fov !== s.perspective) updateCamera();

      const settingsKey = JSON.stringify(s) + backColorRef.current;
      const isMoving =
        Math.abs(peel) > 0.0005 ||
        target !== 0 ||
        reveal.progress < 1 ||
        Boolean(video);
      // One last frame when it comes to rest, so it settles exactly flat.
      if (wasMoving && !isMoving) needsRender = true;
      wasMoving = isMoving;
      if (settingsKey !== lastSettingsKey) {
        lastSettingsKey = settingsKey;
        needsRender = true;
      }

      if (isTextureReady && (isMoving || needsRender)) {
        renderer.render(scene, camera);
        needsRender = false;
        wrapper.dataset.ready = 'true';
      }

      frameId = requestAnimationFrame(tick);
    };

    /** Only animate while on (or near) screen */
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frameId);
        if (!entry.isIntersecting) return;
        lastTime = performance.now();
        lastScrollY = window.scrollY;
        frameId = requestAnimationFrame(tick);
      },
      { rootMargin: '200px 0px' },
    );
    visibilityObserver.observe(wrapper);

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        maybeReveal();
      },
      { threshold: 0.35 },
    );
    revealObserver.observe(wrapper);

    window.addEventListener(STICKER_REPLAY_EVENT, playReveal);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      revealAnimation?.stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener(STICKER_REPLAY_EVENT, playReveal);
      image?.removeEventListener('load', onImageLoad);
      video?.removeEventListener('loadeddata', onVideoData);
      delete wrapper.dataset.ready;
      geometry.dispose();
      material.dispose();
      shadowMaterial.dispose();
      texture.dispose();
      if (!video) (texture.image as ImageBitmap | null)?.close?.();
      renderer.dispose();
      // dispose() keeps the GL context alive until GC; browsers cap live
      // contexts (~16), so release it now (StrictMode remounts double them).
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [prefersReducedMotion, shouldReveal]);

  const mediaClassName = cx(
    'object-cover rounded-3xl',
    shouldReveal
      ? 'motion-safe:opacity-0 group-data-[fallback=true]:opacity-100'
      : 'group-data-[ready=true]:opacity-0',
  );

  return (
    <div
      ref={wrapperRef}
      className={cx('group relative', className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* With a reveal, hidden from the first paint (the canvas unrolls
          it); otherwise visible until the canvas is ready. Either way it is
          the fallback for reduced motion and missing WebGL. */}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={src}
          aria-label={alt}
          // Started from the effect, only when motion is allowed: looping
          // video is motion too. Under reduced motion it waits, with controls.
          controls={prefersReducedMotion === true}
          muted
          loop
          playsInline
          preload="auto"
          className={cx('absolute inset-0 size-full', mediaClassName)}
        />
      ) : (
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          className={mediaClassName}
        />
      )}
      <div
        ref={canvasHostRef}
        aria-hidden
        className="absolute pointer-events-none opacity-0 group-data-[ready=true]:opacity-100"
        style={{
          top: -CANVAS_PADDING,
          left: -CANVAS_PADDING,
          width: `calc(100% + ${CANVAS_PADDING * 2}px)`,
          height: `calc(100% + ${CANVAS_PADDING * 2}px)`,
        }}
      />
    </div>
  );
}

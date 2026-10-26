'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';

const sizes = {
  width: 500,
  height: 500,
};

export default function Debug() {
  useEffect(() => {
    const canvas = document.querySelector('canvas.webgl-canvas');
    if (!canvas) return;

    const setupCanvas = () => {
      const timer = new THREE.Timer();
      timer.connect(window.document);

      const canvasRect = canvas.getBoundingClientRect();
      const canvasPostion = {
        x: canvasRect.x,
        y: canvasRect.y,
      };

      const debugObject = {
        laptopScale: 1,
        cameraXscale: 0.12,
        cameraYscale: 0.12,
        floatAmplitudeX: 0.05,
        floatAmplitudeY: 0.03,
        floatFrequencyX: 0.6,
        floatFrequencyY: 0.9,
        floatPhase: Math.PI / 2,
        floatRotationStrength: 5,
      };

      const gui = new GUI({
        width: 400,
        title: 'Debug Controls',
        closeFolders: true,
      });

      gui
        .add(debugObject, 'floatAmplitudeX')
        .min(0)
        .max(0.2)
        .step(0.005)
        .name('Float Amp X');
      gui
        .add(debugObject, 'floatAmplitudeY')
        .min(0)
        .max(0.2)
        .step(0.005)
        .name('Float Amp Y');
      gui
        .add(debugObject, 'floatFrequencyX')
        .min(0)
        .max(3)
        .step(0.1)
        .name('Float Freq X');
      gui
        .add(debugObject, 'floatFrequencyY')
        .min(0)
        .max(3)
        .step(0.1)
        .name('Float Freq Y');
      gui.add(debugObject, 'floatRotationStrength').min(0).max(10).step(0.5);

      /** Texture atlas (public/case-1/texture.json) */
      const atlas = { width: 3157, height: 1897 };
      const comicBoxFrame = { x: 8, y: 8, w: 1884, h: 1881 };
      // free-tex-packer rotated this one 90° to pack it tighter.
      const laptopFrame = { x: 1908, y: 8, w: 1505, h: 1241 };

      const textureLoader = new THREE.TextureLoader();

      const ComicBoxtexture = textureLoader.load('/case-1/texture.png');
      ComicBoxtexture.colorSpace = THREE.SRGBColorSpace;
      // Not rotated in the atlas: a plain offset/repeat crop is enough.
      ComicBoxtexture.repeat.set(
        comicBoxFrame.w / atlas.width,
        comicBoxFrame.h / atlas.height,
      );
      ComicBoxtexture.offset.set(
        comicBoxFrame.x / atlas.width,
        1 - (comicBoxFrame.y + comicBoxFrame.h) / atlas.height,
      );

      const LaptopTexture = textureLoader.load('/case-1/texture.png');
      LaptopTexture.colorSpace = THREE.SRGBColorSpace;
      // Rotated in the atlas: offset/repeat can't express a 90° rotation,
      // so this texture keeps its default UV space and the plane below
      // gets hand-mapped UVs instead (see laptopGeometry).

      /** Scene */
      const scene = new THREE.Scene();

      /** Camera */
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100,
      );

      camera.position.set(0, 0, 0.75);
      gui.add(camera.position, 'z').min(0).step(0.25).name('Camera');

      scene.add(camera);

      /** Meshes */

      const comicBoxSizes = {
        width: 1,
        height: comicBoxFrame.h / comicBoxFrame.w,
      };
      const geometry = new THREE.PlaneGeometry(
        comicBoxSizes.width,
        comicBoxSizes.height,
      );
      const material = new THREE.MeshBasicMaterial({ map: ComicBoxtexture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const laptopSizes = {
        width: 1,
        height: laptopFrame.h / laptopFrame.w,
      };
      const laptopGeometry = new THREE.PlaneGeometry(
        laptopSizes.width,
        laptopSizes.height,
      );

      // Re-map each plane corner to where that corner of the *original*
      // (upright) sprite landed once free-tex-packer rotated it 90° into
      // the atlas, so the laptop renders right-side up instead of on its side.
      const u = (px: number) => px / atlas.width;
      const v = (py: number) => 1 - py / atlas.height;
      laptopGeometry.setAttribute(
        'uv',
        new THREE.Float32BufferAttribute(
          [
            // top-left
            u(laptopFrame.x + laptopFrame.h),
            v(laptopFrame.y),
            // top-right
            u(laptopFrame.x + laptopFrame.h),
            v(laptopFrame.y + laptopFrame.w),
            // bottom-left
            u(laptopFrame.x),
            v(laptopFrame.y),
            // bottom-right
            u(laptopFrame.x),
            v(laptopFrame.y + laptopFrame.w),
          ],
          2,
        ),
      );

      const laptopMaterial = new THREE.MeshBasicMaterial({
        map: LaptopTexture,
        transparent: true,
      });
      const laptopMesh = new THREE.Mesh(laptopGeometry, laptopMaterial);
      laptopMesh.position.z = 0.1;
      laptopMesh.scale.set(0.6, 0.6);

      gui
        .add(laptopMesh.position, 'z')
        .min(0)
        .max(0.75)
        .step(0.05)
        .name('Laptop');

      gui
        .add(debugObject, 'laptopScale')
        .name('Laptop Scale')
        .min(0)
        .max(1)
        .step(0.05)
        .onChange((newValue: number) => {
          laptopMesh.scale.set(newValue, newValue);
        });

      const objects = new THREE.Group();
      objects.add(laptopMesh);
      scene.add(objects);

      /**
       * Render
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor('black', 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      let tween: undefined | any;
      let objectTween: undefined | any;

      const updateCameraPosition = (e: Event) => {
        const windowX =
          ((e as MouseEvent).pageX - canvasPostion.x) / sizes.width - 0.5;
        const windowY =
          ((e as MouseEvent).pageY - canvasPostion.y) / sizes.height - 0.5;

        tween = gsap.to(camera.position, {
          x: -debugObject.cameraXscale * windowX,
          y: -debugObject.cameraYscale * windowY,
          duration: 0.75,
          delay: 0,
        });

        objectTween = gsap.to(objects.position, {
          x: -debugObject.cameraXscale * windowX,
          y: debugObject.cameraYscale * windowY,
          duration: 0.75,
          delay: 0,
        });
      };

      const resetCameraPosition = () => {
        if (tween.isActive()) {
          tween.kill();
        }

        if (objectTween.isActive()) {
          objectTween.kill();
        }

        gsap.to(camera.position, {
          x: 0,
          y: 0,
          duration: 0.75,
          delay: 0,
        });

        gsap.to(objects.position, {
          x: 0,
          y: 0,
          duration: 0.75,
          delay: 0,
        });
      };

      canvas.addEventListener('mousemove', updateCameraPosition);
      canvas.addEventListener('mouseleave', resetCameraPosition);
      gui.add(debugObject, 'cameraXscale').min(0).max(1);
      gui.add(debugObject, 'cameraYscale').min(0).max(1);

      /** Animate */
      let animationFrameId: number;
      const tick = () => {
        /** Animate laptop using lissajous curves */
        timer.update();
        const elapsedTime = timer.getElapsed();

        const floatX =
          debugObject.floatFrequencyX * elapsedTime + debugObject.floatPhase;

        laptopMesh.position.x = debugObject.floatAmplitudeX * Math.sin(floatX);
        laptopMesh.position.y =
          debugObject.floatAmplitudeY *
          Math.sin(debugObject.floatFrequencyY * elapsedTime);

        const velocityX =
          debugObject.floatAmplitudeX *
          debugObject.floatFrequencyX *
          Math.cos(floatX);

        laptopMesh.rotation.z = velocityX * debugObject.floatRotationStrength;

        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);

        animationFrameId = window.requestAnimationFrame(tick);
      };

      tick();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', updateCameraPosition);
        canvas.removeEventListener('mouseleave', resetCameraPosition);
        tween?.kill();
        objectTween?.kill();
        gui.destroy();
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        laptopGeometry.dispose();
        laptopMaterial.dispose();
        ComicBoxtexture.dispose();
        LaptopTexture.dispose();
      };
    };

    return setupCanvas();
  }, []);

  return (
    <main className="p-4 flex flex-col gap-4">
      <section className="bg-foreground p-10 flex flex-col gap-4 rounded-3xl">
        <h1 className="font-primary font-bold text-[64px] uppercase leading-none">
          Where the magic happen...
        </h1>
        <p className="font-secondary text-[24px] leading-none">
          This is the debug page
        </p>
      </section>
      <section className="bg-foreground p-10 flex flex-col gap-4 rounded-3xl">
        <canvas
          className="webgl-canvas"
          width={sizes.width}
          height={sizes.height}
        />
      </section>
    </main>
  );
}

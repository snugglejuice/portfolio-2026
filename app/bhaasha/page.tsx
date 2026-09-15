'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import vertexShader from './shaders/vertex';
import fragmentShader from './shaders/fragment';

import './styles.css';

export default function Bhaasha() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;

    const setupExperience = () => {
      if (!canvasRef.current) return;

      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const timer = new THREE.Timer();
      timer.connect(window.document);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1);
      camera.position.set(0, 0, 1);
      scene.add(camera);

      /** Meshes */
      const uniforms = {
        uAspect: { value: sizes.width / sizes.height },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      };
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      const planeMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(planeMesh);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor('black', 0);

      const mouseTarget = new THREE.Vector2(0.5, 0.5);
      const handleMouseMove = (e: MouseEvent) => {
        mouseTarget.set(
          e.clientX / window.innerWidth,
          1 - e.clientY / window.innerHeight,
        );
      };
      window.addEventListener('pointermove', handleMouseMove);

      let frameId: number;
      const tick = () => {
        timer.update();
        const elapsedTime = timer.getElapsed();

        uniforms.uTime.value = elapsedTime;
        uniforms.uMouse.value.lerp(mouseTarget, 0.05);

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(tick);
      };

      tick();

      // wait two animation frames: the first guarantees the browser has
      // committed the shader's first render to the canvas, the second is
      // the frame where we actually start the opacity transition — this
      // avoids the fade starting before there's anything drawn yet
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          canvasRef.current?.classList.add('is-ready');
        });
      });

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.uAspect.value = window.innerWidth / window.innerHeight;
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(frameId);
        renderer.dispose();
        planeGeometry.dispose();
        planeMaterial.dispose();
      };
    };

    setupExperience();
  }, []);

  return (
    <main className="p-4 flex flex-col gap-4 min-w-screen min-h-screen">
      <section className="relative w-full h-[calc(100vh-32px)] bg-foreground p-10 flex flex-col gap-4 rounded-3xl items-center justify-center overflow-hidden">
        <canvas
          className="canvas-webgl w-screen h-screen absolute inset-0 z-0"
          ref={canvasRef}
        />
        <div className="relative z-1">
          <h1 className="font-primary font-extrabold text-8xl text-white">
            Blob.
          </h1>
        </div>
      </section>
    </main>
  );
}

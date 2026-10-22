'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from './Loader';
import { CarveToolbar } from './ui/CarveToolbar';
import { Scene } from './scene/Scene';

export const Experience = () => (
  <div className="fixed inset-0 overflow-hidden overscroll-none bg-black">
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 40, position: [0, 0, 5] }}
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
    <Loader />
    <CarveToolbar />
  </div>
);

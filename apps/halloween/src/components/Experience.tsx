'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { trackPhaseChanges } from '@/lib/analytics/trackPhaseChanges';
import { useCarveStore } from '@/store/useCarveStore';
import { useAudioDirector } from './audio/useAudioDirector';
import { Loader } from './Loader';
import { CarveToolbar } from './ui/CarveToolbar';
import { FortuneCard } from './ui/FortuneCard';
import { IntroOverlay } from './ui/IntroOverlay';
import { MuteButton } from './ui/MuteButton';
import { RevealPanel } from './ui/RevealPanel';
import { TemplatePicker } from './ui/TemplatePicker';
import { GlCapture } from './scene/GlCapture';
import { Scene } from './scene/Scene';

export const Experience = () => {
  useAudioDirector();
  useEffect(() => trackPhaseChanges(useCarveStore), []);

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-black">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          // Lets the share card read the frame back at any time.
          preserveDrawingBuffer: true,
        }}
        camera={{ fov: 40, position: [0, 0, 5] }}
        style={{ touchAction: 'none' }}
      >
        <GlCapture />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
      <CarveToolbar />
      <TemplatePicker />
      <FortuneCard />
      <RevealPanel />
      <MuteButton />
      <IntroOverlay />
    </div>
  );
};

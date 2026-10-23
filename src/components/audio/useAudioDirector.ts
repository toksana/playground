import { useEffect } from 'react';
import {
  LAYER_FADE_MS,
  carveRate,
  carveVolume,
  phaseMix,
  strokeSpeed,
} from '@/lib/audio/audioMix';
import type { Layer } from '@/lib/audio/audioMix';
import * as sound from '@/lib/audio/sound';
import { useAudioStore } from '@/store/useAudioStore';
import { useCarveStore } from '@/store/useCarveStore';
import type { Phase } from '@/store/useCarveStore';

const CARVE_RELEASE_MS = 150;
const CARVE_IDLE_MS = 120;
const LAYERS: Layer[] = ['ambient', 'crackle', 'music'];

const applyPhase = (phase: Phase): void => {
  const mix = phaseMix(phase);
  LAYERS.forEach((layer) =>
    sound.fadeTo(layer, mix[layer], LAYER_FADE_MS[layer]),
  );
  if (phase === 'lighting') sound.playOnce('ignite');
};

// Drives all sound from the carve store: phase layers, ignite one-shot and the scrape
// that follows the pointer speed while carving.
export const useAudioDirector = (): void => {
  useEffect(() => {
    useAudioStore.getState().hydrate();
    sound.preload();

    let lastMoveAt = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const stopCarve = (): void => {
      clearTimeout(idleTimer);
      sound.fadeTo('carve', 0, CARVE_RELEASE_MS);
    };

    const followPointer = (speed: number): void => {
      sound.set('carve', carveVolume(speed), carveRate(speed));
      clearTimeout(idleTimer);
      idleTimer = setTimeout(
        () => sound.fadeTo('carve', 0, CARVE_RELEASE_MS),
        CARVE_IDLE_MS,
      );
    };

    const unsubscribe = useCarveStore.subscribe((state, prev) => {
      if (state.phase !== prev.phase) applyPhase(state.phase);

      const { current } = state;
      if (current === null) {
        if (prev.current !== null) stopCarve();
        return;
      }
      const pts = current.pts;
      const grew =
        prev.current === null || pts.length > prev.current.pts.length;
      if (!grew) return;

      const now = performance.now();
      const last = pts[pts.length - 2];
      const next = pts[pts.length - 1];
      const speed =
        last === undefined || prev.current === null
          ? 0
          : strokeSpeed(last, next, now - lastMoveAt);
      lastMoveAt = now;
      followPointer(speed);
    });

    return () => {
      unsubscribe();
      clearTimeout(idleTimer);
    };
  }, []);
};

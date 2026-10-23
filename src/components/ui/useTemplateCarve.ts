import { useEffect, useRef } from 'react';
import {
  buildTimeline,
  CARVE_DURATION_MS,
  sampleTimeline,
} from '@/lib/carve/animateStrokes';
import type { Template } from '@/lib/carve/templates';
import { useCarveStore } from '@/store/useCarveStore';

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Carves a template stroke by stroke over ~1.2 s. The strokes reach the mask through
// `current`, so the scrape sound (useAudioDirector) follows the knife with no extra wiring.
export const useTemplateCarve = (): ((template: Template) => void) => {
  const frame = useRef<number | null>(null);
  // Completes the running animation (loads the whole template), or null when idle.
  const complete = useRef<(() => void) | null>(null);

  const cancelFrame = (): void => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  // Unmounting mid-animation must not leave input blocked: jump to the finished template.
  useEffect(
    () => () => {
      cancelFrame();
      complete.current?.();
    },
    [],
  );

  return (template) => {
    cancelFrame();
    const { loadTemplate, startTemplateAnimation, advanceTemplateAnimation } =
      useCarveStore.getState();
    const finish = (): void => {
      cancelFrame();
      complete.current = null;
      loadTemplate(template.id, template.strokes);
    };
    complete.current = finish;

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const timeline = buildTimeline(template.strokes);
    const startedAt = performance.now();
    startTemplateAnimation();

    const tick = (now: number): void => {
      const elapsed = now - startedAt;
      if (
        elapsed >= CARVE_DURATION_MS ||
        useCarveStore.getState().phase !== 'carving'
      ) {
        finish();
        return;
      }
      const { doneCount, partial } = sampleTimeline(timeline, elapsed);
      advanceTemplateAnimation(template.strokes, doneCount, partial);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
};

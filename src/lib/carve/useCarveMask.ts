import { useEffect, useMemo } from 'react';
import { useCarveStore } from '@/store/useCarveStore';
import { createMask, pickMaskSize } from './maskCanvas';
import type { Mask } from './maskCanvas';
import { applyMaskUpdate, planMaskUpdate } from './maskSync';

// Mask canvas kept in sync with the carve store: incremental while drawing, full redraw otherwise.
export const useCarveMask = (): Mask => {
  const mask = useMemo(
    () => createMask(pickMaskSize(), useCarveStore.getState().strokes),
    [],
  );

  useEffect(() => {
    const unsubscribe = useCarveStore.subscribe((state, prev) =>
      applyMaskUpdate(mask, state, planMaskUpdate(prev, state)),
    );
    // Catch up with anything that changed between creating the mask and subscribing.
    applyMaskUpdate(mask, useCarveStore.getState(), { kind: 'full' });

    return () => {
      unsubscribe();
      mask.texture.dispose();
    };
  }, [mask]);

  return mask;
};

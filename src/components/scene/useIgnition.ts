import { useEffect } from 'react';
import { useCarveStore } from '@/store/useCarveStore';

export const IGNITION_MS = 2000;

// Moves from `lighting` to `reveal` once the ignition animation has played.
export const useIgnition = (): void => {
  const phase = useCarveStore((s) => s.phase);

  useEffect(() => {
    if (phase !== 'lighting') return;
    const timer = setTimeout(
      () => useCarveStore.getState().setPhase('reveal'),
      IGNITION_MS,
    );
    return () => clearTimeout(timer);
  }, [phase]);
};

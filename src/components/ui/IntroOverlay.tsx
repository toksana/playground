'use client';

import { useCarveStore } from '@/store/useCarveStore';

export const IntroOverlay = () => {
  const visible = useCarveStore((s) => s.phase === 'intro');
  const setPhase = useCarveStore((s) => s.setPhase);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => setPhase('carving')}
      className="absolute inset-0 grid place-items-center bg-black/40 text-lg tracking-widest text-orange-100 uppercase select-none"
    >
      Tap to enter
    </button>
  );
};

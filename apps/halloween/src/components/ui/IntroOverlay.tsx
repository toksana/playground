'use client';

import { trackEvent } from '@playground/shared/analytics';
import { unlock } from '@/lib/audio/sound';
import { useCarveStore } from '@/store/useCarveStore';

export const IntroOverlay = () => {
  const visible = useCarveStore((s) => s.phase === 'intro');
  const setPhase = useCarveStore((s) => s.setPhase);

  if (!visible) return null;

  // Unlock first, synchronously: iOS and Chrome only allow audio inside a user gesture.
  const enter = (): void => {
    unlock();
    trackEvent('tap_to_enter');
    setPhase('carving');
  };

  return (
    <button
      type="button"
      onClick={enter}
      className="absolute inset-0 grid place-items-center bg-black/40 text-lg tracking-widest text-orange-100 uppercase select-none"
    >
      Tap to enter
    </button>
  );
};

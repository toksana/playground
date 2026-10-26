'use client';

import { useEffect, useState } from 'react';

// OrbitControls take over once the camera has settled, so the hint waits a moment.
const SHOW_DELAY_MS = 1500;

// Tells the user the lit pumpkin can be turned. Gone after the first touch or click.
export const RotateHint = () => {
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), SHOW_DELAY_MS);
    const dismiss = (): void => setDismissed(true);
    window.addEventListener('pointerdown', dismiss, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', dismiss);
    };
  }, []);

  if (!ready || dismissed) return null;

  return (
    <p
      aria-hidden
      className="pointer-events-none animate-pulse rounded-full border border-orange-300/30 bg-black/50 px-4 py-2 text-sm text-orange-100 backdrop-blur select-none motion-reduce:animate-none"
    >
      ← Drag to rotate →
    </p>
  );
};

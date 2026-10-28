'use client';

import { CANDLES } from '@/lib/fortune/candles';
import { FORTUNES } from '@/lib/fortune/fortunes';
import { useCarveStore } from '@/store/useCarveStore';

// What the pumpkin says, shown above it once the candle is lit.
export const FortuneCard = () => {
  const fortune = useCarveStore((s) =>
    s.phase === 'reveal' ? s.fortune : null,
  );

  if (fortune === null) return null;

  return (
    <p
      className="pointer-events-none absolute top-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] left-1/2 w-[min(90vw,30rem)] -translate-x-1/2 text-center text-lg leading-snug text-balance text-orange-50"
      style={{ textShadow: `0 0 18px ${CANDLES[fortune.candleIndex].color}` }}
    >
      {FORTUNES[fortune.fortuneIndex]}
    </p>
  );
};

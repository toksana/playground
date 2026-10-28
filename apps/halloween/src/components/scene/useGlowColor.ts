import { useMemo } from 'react';
import { Color } from 'three';
import { GLOW_COLOR } from '@/lib/carve/look';
import { CANDLES } from '@/lib/fortune/candles';
import { useCarveStore } from '@/store/useCarveStore';

// Colour of the candle light: the drawing's candle once lit, the default ember before that.
export const useGlowColor = (): Color => {
  const hex = useCarveStore((s) =>
    s.fortune === null ? GLOW_COLOR : CANDLES[s.fortune.candleIndex].color,
  );
  return useMemo(() => new Color(hex), [hex]);
};

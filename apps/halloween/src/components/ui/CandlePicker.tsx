'use client';

import { trackEvent } from '@playground/shared/analytics';
import { CANDLES } from '@/lib/fortune/candles';
import { useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

// Candle colour swatches in reveal; the drawing's own candle starts selected.
export const CandlePicker = () => {
  const candleIndex = useCarveStore((s) => s.fortune?.candleIndex ?? null);
  const setCandle = useCarveStore((s) => s.setCandle);

  const pick = (index: number): void => {
    trackEvent('candle_pick', { candle: CANDLES[index].id });
    setCandle(index);
  };

  return (
    <div role="group" aria-label="Candle color" className="flex flex-row gap-2">
      {CANDLES.map((candle, i) => (
        <ToolButton
          key={candle.id}
          active={candleIndex === i}
          aria-pressed={candleIndex === i}
          aria-label={`${candle.name} candle`}
          onClick={() => pick(i)}
        >
          <span
            className="size-4 rounded-full"
            style={{ backgroundColor: candle.color }}
          />
        </ToolButton>
      ))}
    </div>
  );
};

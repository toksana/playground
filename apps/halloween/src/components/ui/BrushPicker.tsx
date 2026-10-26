'use client';

import { BRUSH_SIZES, useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

const BRUSH_LABELS = ['Thin brush', 'Medium brush', 'Thick brush'] as const;
const DOT_PX = [6, 10, 16] as const;

// Top-left corner on touch devices, first group of the side bar with a mouse.
export const BrushPicker = () => {
  const brush = useCarveStore((s) => s.brush);
  const setBrush = useCarveStore((s) => s.setBrush);

  return (
    <div className="absolute top-[calc(max(0.5rem,env(safe-area-inset-top))+2rem)] left-4 flex flex-row gap-2 pointer-fine:static pointer-fine:flex-col">
      {BRUSH_SIZES.map((size, i) => (
        <ToolButton
          key={size}
          active={brush === size}
          aria-pressed={brush === size}
          aria-label={BRUSH_LABELS[i]}
          onClick={() => setBrush(size)}
        >
          <span
            className="rounded-full bg-orange-200"
            style={{ width: DOT_PX[i], height: DOT_PX[i] }}
          />
        </ToolButton>
      ))}
    </div>
  );
};

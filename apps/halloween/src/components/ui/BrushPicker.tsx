'use client';

import { BRUSH_SIZES, useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

const BRUSH_LABELS = ['Thin brush', 'Medium brush', 'Thick brush'] as const;
const DOT_PX = [6, 10, 16] as const;

// First group of the tools bar (see CarveToolbar).
export const BrushPicker = () => {
  const brush = useCarveStore((s) => s.brush);
  const setBrush = useCarveStore((s) => s.setBrush);

  return (
    <div className="flex flex-row gap-2 pointer-fine:flex-col">
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

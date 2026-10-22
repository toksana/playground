'use client';

import { useCarveStore } from '@/store/useCarveStore';
import { BrushPicker } from './BrushPicker';
import { ToolButton } from './ToolButton';

// Bottom bar on touch devices, side bar with a mouse (PLAN.md section 7).
export const CarveToolbar = () => {
  const visible = useCarveStore((s) => s.phase === 'carving');
  const hasStrokes = useCarveStore((s) => s.strokes.length > 0);
  const undo = useCarveStore((s) => s.undo);
  const clear = useCarveStore((s) => s.clear);

  if (!visible) return null;

  return (
    <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 pointer-fine:top-1/2 pointer-fine:bottom-auto pointer-fine:left-4 pointer-fine:translate-x-0 pointer-fine:-translate-y-1/2 pointer-fine:flex-col">
      <BrushPicker />
      <ToolButton disabled={!hasStrokes} onClick={undo}>
        Undo
      </ToolButton>
      <ToolButton disabled={!hasStrokes} onClick={clear}>
        Clear
      </ToolButton>
    </div>
  );
};

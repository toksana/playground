'use client';

import { useCarveStore } from '@/store/useCarveStore';
import { BrushPicker } from './BrushPicker';
import { ToolButton } from './ToolButton';

// Bottom bar on touch devices, side bar with a mouse (PLAN.md section 7).
export const CarveToolbar = () => {
  const visible = useCarveStore((s) => s.phase === 'carving');
  const canEdit = useCarveStore((s) => s.strokes.length > 0 && !s.isAnimating);
  const undo = useCarveStore((s) => s.undo);
  const clear = useCarveStore((s) => s.clear);
  const setPhase = useCarveStore((s) => s.setPhase);

  if (!visible) return null;

  return (
    <div className="contents pointer-fine:absolute pointer-fine:top-1/2 pointer-fine:left-4 pointer-fine:flex pointer-fine:-translate-y-1/2 pointer-fine:flex-col pointer-fine:items-center pointer-fine:gap-2">
      <BrushPicker />
      <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 pointer-fine:static pointer-fine:translate-x-0 pointer-fine:flex-col">
        <ToolButton disabled={!canEdit} onClick={undo}>
          Undo
        </ToolButton>
        <ToolButton disabled={!canEdit} onClick={clear}>
          Clear
        </ToolButton>
        <ToolButton
          active={canEdit}
          disabled={!canEdit}
          className="enabled:animate-pulse motion-reduce:animate-none"
          onClick={() => setPhase('lighting')}
        >
          Light it
        </ToolButton>
      </div>
    </div>
  );
};

'use client';

import { trackEvent } from '@playground/shared/analytics';
import { useCarveStore } from '@/store/useCarveStore';
import { BrushPicker } from './BrushPicker';
import { ToolButton } from './ToolButton';

// Tools (brushes, undo, clear) sit in a row at the top-left on touch devices and in a side bar
// with a mouse. The primary "Light it" action always has its own spot at the bottom centre
// (PLAN.md section 7); template buttons sit above it on touch devices.
export const CarveToolbar = () => {
  const visible = useCarveStore((s) => s.phase === 'carving');
  const canEdit = useCarveStore((s) => s.strokes.length > 0 && !s.isAnimating);
  const isEmpty = useCarveStore(
    (s) => s.strokes.length === 0 && !s.isAnimating,
  );
  const undo = useCarveStore((s) => s.undo);
  const clear = useCarveStore((s) => s.clear);
  const setPhase = useCarveStore((s) => s.setPhase);

  if (!visible) return null;

  const lightIt = (): void => {
    trackEvent('light_it_click');
    setPhase('lighting');
  };

  return (
    <>
      <div className="absolute top-[calc(max(0.5rem,env(safe-area-inset-top))+2rem)] left-4 flex flex-row items-center gap-2 pointer-fine:top-1/2 pointer-fine:-translate-y-1/2 pointer-fine:flex-col">
        <BrushPicker />
        <ToolButton disabled={!canEdit} onClick={undo}>
          Undo
        </ToolButton>
        <ToolButton disabled={!canEdit} onClick={clear}>
          Clear
        </ToolButton>
      </div>
      {isEmpty && (
        <p className="pointer-events-none absolute bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.25rem)] left-1/2 -translate-x-1/2 text-center text-sm whitespace-nowrap text-orange-100/70 pointer-fine:bottom-24">
          Carve a face or pick a template
        </p>
      )}
      <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 pointer-fine:bottom-6">
        <ToolButton
          active={canEdit}
          disabled={!canEdit}
          className="enabled:animate-glow-pulse h-14 px-10 text-base motion-reduce:animate-none"
          onClick={lightIt}
        >
          Light it
        </ToolButton>
      </div>
    </>
  );
};

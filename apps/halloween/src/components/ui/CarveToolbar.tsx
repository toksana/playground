'use client';

import { trackEvent } from '@playground/shared/analytics';
import { useCarveStore } from '@/store/useCarveStore';
import { BrushPicker } from './BrushPicker';
import { ToolButton } from './ToolButton';

interface LightItButtonProps {
  disabled: boolean;
  onClick: () => void;
  className?: string;
}

const LightItButton = ({
  disabled,
  onClick,
  className,
}: LightItButtonProps) => (
  <ToolButton
    active={!disabled}
    disabled={disabled}
    className={`enabled:animate-pulse motion-reduce:animate-none ${className ?? ''}`}
    onClick={onClick}
  >
    Light it
  </ToolButton>
);

// Bottom bar on touch devices; with a mouse the tools sit in a side bar and the primary
// "Light it" action gets its own spot at the bottom centre (PLAN.md section 7).
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
      <div className="contents pointer-fine:absolute pointer-fine:top-1/2 pointer-fine:left-4 pointer-fine:flex pointer-fine:-translate-y-1/2 pointer-fine:flex-col pointer-fine:items-center pointer-fine:gap-2">
        <BrushPicker />
        <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 pointer-fine:static pointer-fine:translate-x-0 pointer-fine:flex-col">
          <ToolButton disabled={!canEdit} onClick={undo}>
            Undo
          </ToolButton>
          <ToolButton disabled={!canEdit} onClick={clear}>
            Clear
          </ToolButton>
          <LightItButton
            disabled={!canEdit}
            onClick={lightIt}
            className="pointer-fine:hidden"
          />
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 pointer-fine:flex">
        {isEmpty && (
          <p className="text-sm text-orange-100/70">
            Carve a face or pick a template
          </p>
        )}
        <LightItButton
          disabled={!canEdit}
          onClick={lightIt}
          className="h-14 px-10 text-base"
        />
      </div>
    </>
  );
};

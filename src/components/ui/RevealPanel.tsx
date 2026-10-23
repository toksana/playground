'use client';

import { useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

export const RevealPanel = () => {
  const visible = useCarveStore((s) => s.phase === 'reveal');
  const clear = useCarveStore((s) => s.clear);
  const setPhase = useCarveStore((s) => s.setPhase);

  if (!visible) return null;

  const carveAgain = (): void => {
    clear();
    setPhase('carving');
  };

  return (
    <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-row items-center gap-2">
      <ToolButton onClick={carveAgain}>Carve again</ToolButton>
    </div>
  );
};

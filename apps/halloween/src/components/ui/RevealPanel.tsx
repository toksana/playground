'use client';

import { trackEvent } from '@playground/shared/analytics';
import { useCarveStore } from '@/store/useCarveStore';
import { CandlePicker } from './CandlePicker';
import { RotateHint } from './RotateHint';
import { SaveImageButton } from './SaveImageButton';
import { ShareOnXButton } from './ShareOnXButton';
import { ToolButton } from './ToolButton';

export const RevealPanel = () => {
  const visible = useCarveStore((s) => s.phase === 'reveal');
  const clear = useCarveStore((s) => s.clear);
  const setPhase = useCarveStore((s) => s.setPhase);

  if (!visible) return null;

  const carveAgain = (): void => {
    trackEvent('carve_again_click');
    clear();
    setPhase('carving');
  };

  return (
    <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
      <CandlePicker />
      <RotateHint />
      <div className="flex max-w-[22rem] flex-row flex-wrap justify-center gap-2">
        <ShareOnXButton />
        <SaveImageButton />
        <ToolButton onClick={carveAgain}>Carve again</ToolButton>
      </div>
    </div>
  );
};

'use client';

import { trackEvent } from '@playground/shared/analytics';
import { buildXIntentUrl } from '@/lib/fortune/shareUrl';
import { useCarveStore } from '@/store/useCarveStore';
import { TOOL_BUTTON_CLASS } from './ToolButton';

// A plain link, so popup blockers never get in the way; the seed follows the picked candle.
export const ShareOnXButton = () => {
  const fortune = useCarveStore((s) => s.fortune);

  if (fortune === null) return null;

  return (
    <a
      href={buildXIntentUrl(fortune)}
      target="_blank"
      rel="noopener noreferrer"
      className={TOOL_BUTTON_CLASS}
      onClick={() => trackEvent('share_x_click')}
    >
      Share on X
    </a>
  );
};

'use client';

import { trackEvent } from '@playground/shared/analytics';
import { useMemo } from 'react';
import { buildXIntentUrl } from '@/lib/fortune/shareUrl';
import { useCarveStore } from '@/store/useCarveStore';
import { TOOL_BUTTON_CLASS } from './ToolButton';

// A plain link, so popup blockers never get in the way. The link carries the drawing and follows
// the picked candle; it is rebuilt only when either changes.
export const ShareOnXButton = () => {
  const fortune = useCarveStore((s) => s.fortune);
  const strokes = useCarveStore((s) => s.strokes);
  const href = useMemo(
    () => (fortune === null ? null : buildXIntentUrl(fortune, strokes)),
    [fortune, strokes],
  );

  if (href === null) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={TOOL_BUTTON_CLASS}
      onClick={() => trackEvent('share_x_click')}
    >
      Share on X
    </a>
  );
};

'use client';

import { trackEvent } from '@playground/shared/analytics';
import { useState, useSyncExternalStore } from 'react';
import { CANDLES } from '@/lib/fortune/candles';
import { FORTUNES } from '@/lib/fortune/fortunes';
import { buildShareText, buildShareUrl } from '@/lib/fortune/shareUrl';
import { captureFrame } from '@/lib/share/captureRegistry';
import { composeCard } from '@/lib/share/composeCard';
import {
  canShareFiles,
  saveOrShareCard,
  toPngBlob,
} from '@/lib/share/shareCard';
import { useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

type Status = 'idle' | 'busy' | 'error';

const subscribeNever = (): (() => void) => () => {};

// "Share image" opens the share sheet (Stories, Telegram) where files are supported,
// "Save image" downloads the PNG everywhere else.
export const SaveImageButton = () => {
  const fortune = useCarveStore((s) => s.fortune);
  const [status, setStatus] = useState<Status>('idle');
  const canShare = useSyncExternalStore(
    subscribeNever,
    canShareFiles,
    () => false,
  );

  if (fortune === null) return null;

  const run = async (): Promise<void> => {
    const frame = captureFrame();
    if (frame === null) return;

    setStatus('busy');
    try {
      const card = composeCard(frame, {
        text: FORTUNES[fortune.fortuneIndex],
        color: CANDLES[fortune.candleIndex].color,
      });
      const blob = await toPngBlob(card);
      const text = `${buildShareText(fortune)}\n${buildShareUrl(fortune)}`;
      const mode = await saveOrShareCard(blob, text);
      trackEvent('save_image_click', { mode });
      setStatus('idle');
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      setStatus('error');
    }
  };

  const label =
    status === 'error' ? 'Try again' : canShare ? 'Share image' : 'Save image';

  return (
    <ToolButton disabled={status === 'busy'} onClick={() => void run()}>
      {label}
    </ToolButton>
  );
};

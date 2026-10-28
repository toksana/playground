'use client';

import { trackEvent } from '@playground/shared/analytics';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { CANDLES } from '@/lib/fortune/candles';
import { FORTUNES } from '@/lib/fortune/fortunes';
import { buildShareText, buildShareUrl } from '@/lib/fortune/shareUrl';
import { captureFrame } from '@/lib/share/captureRegistry';
import { composeCard } from '@/lib/share/composeCard';
import { saveButtonLabel } from '@/lib/share/saveButtonLabel';
import type { SaveStatus } from '@/lib/share/saveButtonLabel';
import {
  canShareFiles,
  saveOrShareCard,
  toPngBlob,
} from '@/lib/share/shareCard';
import { useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

const FEEDBACK_MS = 2000;
// Wide enough for the longest label, so the buttons next to it do not jump around.
const MIN_WIDTH = '8rem';

const subscribeNever = (): (() => void) => () => {};

// "Share image" opens the share sheet (Stories, Telegram) where files are supported,
// "Save image" downloads the PNG everywhere else. The label confirms what happened.
export const SaveImageButton = () => {
  const fortune = useCarveStore((s) => s.fortune);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const canShare = useSyncExternalStore(
    subscribeNever,
    canShareFiles,
    () => false,
  );

  useEffect(() => {
    if (status !== 'saved' && status !== 'shared') return;
    const timer = setTimeout(() => setStatus('idle'), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [status]);

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
      setStatus(mode === 'share' ? 'shared' : 'saved');
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      setStatus('error');
    }
  };

  return (
    <ToolButton
      disabled={status === 'busy'}
      aria-live="polite"
      style={{ minWidth: MIN_WIDTH }}
      onClick={() => void run()}
    >
      {saveButtonLabel(status, canShare)}
    </ToolButton>
  );
};

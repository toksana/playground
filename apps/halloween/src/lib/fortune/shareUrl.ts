import { HUB_URL } from '@playground/shared/links';
import { BASE_PATH } from '@/lib/basePath';
import type { Stroke } from '@/lib/carve/strokes';
import { encodeDrawing } from '@/lib/share/drawingCodec';
import { FORTUNES } from './fortunes';
import type { FortuneResult } from './seed';

// The link carries the drawing itself, so the preview shows the face the user carved.
export const buildShareUrl = (
  result: FortuneResult,
  strokes: Stroke[],
): string => `${HUB_URL}${BASE_PATH}/f/${encodeDrawing(result, strokes)}`;

export const buildShareText = ({ fortuneIndex }: FortuneResult): string =>
  `🎃 "${FORTUNES[fortuneIndex]}"\n\nMy pumpkin told my fortune.`;

export const buildXIntentUrl = (
  result: FortuneResult,
  strokes: Stroke[],
): string => {
  const text = encodeURIComponent(buildShareText(result));
  const url = encodeURIComponent(buildShareUrl(result, strokes));
  return `https://x.com/intent/post?text=${text}&url=${url}`;
};

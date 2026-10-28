import type { Stroke } from '@/lib/carve/strokes';
import { decodeSeed } from '@/lib/fortune/seed';
import type { FortuneResult } from '@/lib/fortune/seed';
import { decodeDrawing } from './drawingCodec';

export interface ShareData extends FortuneResult {
  // null for old "<fortune>-<candle>" links, which carry no drawing.
  strokes: Stroke[] | null;
}

// The path segment after /f/: either an old "7-2" seed or a drawing code.
export const parseShareParam = (param: string): ShareData | null => {
  const legacy = decodeSeed(param);
  if (legacy !== null) return { ...legacy, strokes: null };
  return decodeDrawing(param);
};

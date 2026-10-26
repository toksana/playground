import { drawStroke, renderStrokes } from './maskCanvas';
import type { Mask } from './maskCanvas';
import type { Stroke } from './strokes';

export interface MaskSource {
  strokes: Stroke[];
  current: Stroke | null;
}

export type MaskUpdate =
  { kind: 'none' } | { kind: 'full' } | { kind: 'segment'; stroke: Stroke };

// Decides how the mask canvas must follow a store change.
// Full redraw on undo / clear / load / commit; otherwise draw only the newest segment.
export const planMaskUpdate = (
  prev: MaskSource,
  next: MaskSource,
): MaskUpdate => {
  if (next.strokes !== prev.strokes) return { kind: 'full' };
  if (next.current === prev.current) return { kind: 'none' };
  if (next.current === null) return { kind: 'full' };

  const { w, pts } = next.current;
  return { kind: 'segment', stroke: { w, pts: pts.slice(-2) } };
};

export const applyMaskUpdate = (
  mask: Mask,
  source: MaskSource,
  update: MaskUpdate,
): void => {
  if (update.kind === 'none') return;

  if (update.kind === 'full') {
    renderStrokes(mask.ctx, mask.size, source.strokes);
    if (source.current !== null)
      drawStroke(mask.ctx, mask.size, source.current);
  } else {
    drawStroke(mask.ctx, mask.size, update.stroke);
  }
  mask.texture.needsUpdate = true;
};

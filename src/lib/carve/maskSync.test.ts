import { describe, expect, it } from 'vitest';
import { makeStroke } from './testFactories';
import { planMaskUpdate } from './maskSync';

describe('planMaskUpdate', () => {
  it('does nothing when neither strokes nor current changed', () => {
    const state = { strokes: [makeStroke()], current: null };

    const update = planMaskUpdate(state, { ...state });

    expect(update).toEqual({ kind: 'none' });
  });

  it('asks for a full redraw when the strokes array changed', () => {
    const prev = { strokes: [makeStroke()], current: null };
    const next = { strokes: [], current: null };

    const update = planMaskUpdate(prev, next);

    expect(update).toEqual({ kind: 'full' });
  });

  it('asks for a full redraw when the current stroke was committed or cancelled', () => {
    const strokes = [makeStroke()];
    const prev = { strokes, current: makeStroke() };
    const next = { strokes, current: null };

    const update = planMaskUpdate(prev, next);

    expect(update).toEqual({ kind: 'full' });
  });

  it('draws only the newest segment while a stroke grows', () => {
    const strokes = [makeStroke()];
    const pts: [number, number][] = [
      [0.1, 0.1],
      [0.2, 0.2],
      [0.3, 0.3],
    ];
    const prev = { strokes, current: { w: 0.03, pts: pts.slice(0, 2) } };
    const next = { strokes, current: { w: 0.03, pts } };

    const update = planMaskUpdate(prev, next);

    expect(update).toEqual({
      kind: 'segment',
      stroke: { w: 0.03, pts: [pts[1], pts[2]] },
    });
  });

  it('draws a single dot for the first point of a stroke', () => {
    const strokes = [makeStroke()];
    const prev = { strokes, current: null };
    const next = {
      strokes,
      current: { w: 0.05, pts: [[0.4, 0.4]] as [number, number][] },
    };

    const update = planMaskUpdate(prev, next);

    expect(update).toEqual({ kind: 'segment', stroke: next.current });
  });
});

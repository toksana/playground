import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import {
  buildTimeline,
  partialStroke,
  pathLength,
  sampleTimeline,
} from './animateStrokes';
import type { Stroke } from './strokes';

const makeLine = (length: number, overrides: Partial<Stroke> = {}): Stroke => ({
  w: faker.helpers.arrayElement([0.015, 0.03, 0.05]),
  pts: [
    [0.2, 0.5],
    [0.2 + length, 0.5],
  ],
  ...overrides,
});

describe('buildTimeline', () => {
  it('returns an empty timeline for no strokes', () => {
    expect(buildTimeline([])).toEqual([]);
  });

  it('covers the whole duration with contiguous, ordered slots', () => {
    const strokes = [makeLine(0.1), makeLine(0.2), makeLine(0.3)];
    const duration = faker.number.int({ min: 500, max: 2000 });

    const timeline = buildTimeline(strokes, duration);

    expect(timeline.map((t) => t.stroke)).toEqual(strokes);
    expect(timeline[0].start).toBe(0);
    expect(timeline[1].start).toBeCloseTo(timeline[0].end);
    expect(timeline[2].start).toBeCloseTo(timeline[1].end);
    expect(timeline[2].end).toBeCloseTo(duration);
  });

  it('gives longer strokes more time', () => {
    const timeline = buildTimeline([makeLine(0.1), makeLine(0.3)], 1000);

    const [short, long] = timeline.map((t) => t.end - t.start);

    expect(long).toBeCloseTo(short * 3);
  });

  it('gives a dot a non-zero slot', () => {
    const dot: Stroke = { w: 0.03, pts: [[0.5, 0.5]] };

    const [slot] = buildTimeline([dot, makeLine(0.2)], 1000);

    expect(slot.end - slot.start).toBeGreaterThan(0);
  });
});

describe('partialStroke', () => {
  it('cuts the stroke at the given fraction of its length', () => {
    const stroke = makeLine(0.4);

    const half = partialStroke(stroke, 0.5);

    expect(half.pts).toHaveLength(2);
    expect(half.pts[1][0]).toBeCloseTo(0.4);
    expect(pathLength(half.pts)).toBeCloseTo(0.2);
  });

  it('keeps whole segments before the tip', () => {
    const stroke: Stroke = {
      w: 0.03,
      pts: [
        [0.2, 0.2],
        [0.4, 0.2],
        [0.4, 0.6],
      ],
    };

    const cut = partialStroke(stroke, 0.75);

    expect(cut.pts.slice(0, 2)).toEqual(stroke.pts.slice(0, 2));
    expect(cut.pts[2][0]).toBeCloseTo(0.4);
    expect(cut.pts[2][1]).toBeCloseTo(0.45);
  });

  it('returns the full path at fraction 1 and drops fill', () => {
    const stroke = makeLine(0.3, { fill: true });

    const whole = partialStroke(stroke, 1);

    expect(whole.pts).toEqual(stroke.pts);
    expect(whole.fill).toBeUndefined();
  });

  it('keeps only the first point at fraction 0', () => {
    const stroke = makeLine(0.3);

    const start = partialStroke(stroke, 0);

    expect(start.pts).toEqual([stroke.pts[0], stroke.pts[0]]);
  });
});

describe('sampleTimeline', () => {
  const strokes = [makeLine(0.2), makeLine(0.2), makeLine(0.2)];
  const timeline = buildTimeline(strokes, 900);

  it('starts with nothing carved and the first stroke just beginning', () => {
    const frame = sampleTimeline(timeline, 0);

    expect(frame.doneCount).toBe(0);
    expect(frame.partial?.pts[0]).toEqual(strokes[0].pts[0]);
  });

  it('counts finished strokes and cuts the active one', () => {
    const frame = sampleTimeline(timeline, 450);

    expect(frame.doneCount).toBe(1);
    expect(frame.partial?.pts[1][0]).toBeCloseTo(0.3);
  });

  it('is complete at and after the end', () => {
    const atEnd = sampleTimeline(timeline, 900);
    const after = sampleTimeline(timeline, 5000);

    expect(atEnd).toEqual({ doneCount: 3, partial: null });
    expect(after).toEqual({ doneCount: 3, partial: null });
  });

  it('handles an empty timeline', () => {
    expect(sampleTimeline([], 100)).toEqual({ doneCount: 0, partial: null });
  });
});

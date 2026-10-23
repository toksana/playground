import { describe, expect, it } from 'vitest';
import { TEMPLATES } from './templates';

const MAX_POINTS = 450;
// Front part of the pumpkin where the face is meant to sit.
const FACE_MIN = 0.2;
const FACE_MAX = 0.8;

describe('TEMPLATES', () => {
  it('has unique ids', () => {
    const ids = TEMPLATES.map((t) => t.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(TEMPLATES.map((t) => [t.id, t] as const))(
    '%s has drawable strokes inside the face area',
    (_id, template) => {
      const strokes = template.strokes;

      expect(strokes.length).toBeGreaterThan(0);
      strokes.forEach(({ w, pts }) => {
        expect(w).toBeGreaterThan(0);
        expect(w).toBeLessThanOrEqual(0.05);
        expect(pts.length).toBeGreaterThanOrEqual(2);
        pts.forEach(([u, v]) => {
          expect(u).toBeGreaterThanOrEqual(FACE_MIN);
          expect(u).toBeLessThanOrEqual(FACE_MAX);
          expect(v).toBeGreaterThanOrEqual(FACE_MIN);
          expect(v).toBeLessThanOrEqual(FACE_MAX);
        });
      });
    },
  );

  it.each(TEMPLATES.map((t) => [t.id, t] as const))(
    '%s fits the share-link point budget',
    (_id, template) => {
      const total = template.strokes.reduce((n, s) => n + s.pts.length, 0);

      expect(total).toBeLessThan(MAX_POINTS);
    },
  );
});

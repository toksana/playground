import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { makeStroke } from './testFactories';
import {
  pickRandomTemplate,
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  templatesByCategory,
} from './templates';
import type { Template } from './templates';

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

  it('assigns every template to a known category', () => {
    const known = TEMPLATE_CATEGORIES.map((c) => c.id);

    TEMPLATES.forEach((t) => expect(known).toContain(t.category));
  });
});

describe('templatesByCategory', () => {
  it.each(TEMPLATE_CATEGORIES.map((c) => [c.id] as const))(
    'returns only %s templates',
    (category) => {
      const result = templatesByCategory(category);

      result.forEach((t) => expect(t.category).toBe(category));
    },
  );

  it('covers all templates across categories', () => {
    const total = TEMPLATE_CATEGORIES.reduce(
      (n, c) => n + templatesByCategory(c.id).length,
      0,
    );

    expect(total).toBe(TEMPLATES.length);
  });
});

describe('pickRandomTemplate', () => {
  const makeTemplate = (): Template => ({
    id: faker.string.uuid(),
    label: faker.word.noun(),
    category: 'faces',
    strokes: [makeStroke()],
  });

  it('never returns the excluded template', () => {
    const pool = [makeTemplate(), makeTemplate(), makeTemplate()];
    const [excluded] = pool;

    [0, 0.34, 0.67, 0.999].forEach((r) => {
      const picked = pickRandomTemplate(excluded.id, () => r, pool);

      expect(picked).not.toBeNull();
      expect(picked?.id).not.toBe(excluded.id);
    });
  });

  it('uses the injected rng to choose from the remaining templates', () => {
    const pool = [makeTemplate(), makeTemplate(), makeTemplate()];

    const first = pickRandomTemplate(null, () => 0, pool);
    const last = pickRandomTemplate(null, () => 0.999, pool);

    expect(first).toBe(pool[0]);
    expect(last).toBe(pool[2]);
  });

  it('returns null when the only template is excluded', () => {
    const only = makeTemplate();

    expect(pickRandomTemplate(only.id, () => 0, [only])).toBeNull();
  });
});

import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import {
  availableCategories,
  categoryOfTemplate,
  shouldCloseOnSwipe,
  SWIPE_CLOSE_DISTANCE,
} from './templateMenu';
import type { Template } from './templates';
import { makeStroke } from './testFactories';

const makeTemplate = (category: Template['category']): Template => ({
  id: faker.string.uuid(),
  label: faker.word.noun(),
  category,
  strokes: [makeStroke()],
});

describe('availableCategories', () => {
  it('hides categories without templates', () => {
    const templates = [makeTemplate('faces'), makeTemplate('dev')];

    const result = availableCategories(templates);

    expect(result.map((c) => c.id)).toEqual(['faces', 'dev']);
  });

  it('returns nothing when there are no templates', () => {
    expect(availableCategories([])).toEqual([]);
  });
});

describe('categoryOfTemplate', () => {
  it('returns the category of a known template', () => {
    const template = makeTemplate('shapes');

    const result = categoryOfTemplate(template.id, [template]);

    expect(result).toBe('shapes');
  });

  it('returns null for null or unknown ids', () => {
    const templates = [makeTemplate('faces')];

    expect(categoryOfTemplate(null, templates)).toBeNull();
    expect(categoryOfTemplate(faker.string.uuid(), templates)).toBeNull();
  });
});

describe('shouldCloseOnSwipe', () => {
  it('closes after a long enough downward drag', () => {
    const startY = faker.number.int({ min: 100, max: 400 });

    const result = shouldCloseOnSwipe(startY, startY + SWIPE_CLOSE_DISTANCE);

    expect(result).toBe(true);
  });

  it('ignores short drags and upward drags', () => {
    const startY = faker.number.int({ min: 100, max: 400 });

    expect(shouldCloseOnSwipe(startY, startY + SWIPE_CLOSE_DISTANCE - 1)).toBe(
      false,
    );
    expect(shouldCloseOnSwipe(startY, startY - 100)).toBe(false);
  });
});

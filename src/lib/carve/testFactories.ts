import { faker } from '@faker-js/faker';
import type { Point, Stroke } from './strokes';

export const makePoint = (): Point => [
  faker.number.float({ min: 0, max: 1 }),
  faker.number.float({ min: 0, max: 1 }),
];

export const makeStroke = (overrides: Partial<Stroke> = {}): Stroke => ({
  w: faker.helpers.arrayElement([0.015, 0.03, 0.05]),
  pts: [makePoint(), makePoint()],
  ...overrides,
});

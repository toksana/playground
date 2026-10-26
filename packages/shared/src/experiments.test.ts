import { describe, expect, it } from 'vitest';
import {
  EXPERIMENTS,
  MONTH_LABELS,
  SEASON_PARTS,
  buildTimeline,
} from './experiments';
import type { Experiment } from './experiments';

const makeExperiment = (overrides: Partial<Experiment>): Experiment => ({
  id: 'test',
  monthIndex: 0,
  tag: 'Test 2026',
  title: 'Test',
  description: 'A test experiment.',
  accent: 'amber',
  status: 'soon',
  href: '/test',
  ...overrides,
});

describe('buildTimeline', () => {
  it('returns one slot per month of the season', () => {
    // Arrange
    const experiments: Experiment[] = [];

    // Act
    const timeline = buildTimeline(experiments);

    // Assert
    expect(timeline.map((slot) => slot.label)).toEqual([...MONTH_LABELS]);
    expect(timeline.every((slot) => slot.experiment === null)).toBe(true);
  });

  it('places an experiment in the slot of its month', () => {
    // Arrange
    const experiment = makeExperiment({ monthIndex: 5 });

    // Act
    const timeline = buildTimeline([experiment]);

    // Assert
    expect(timeline[5].experiment).toEqual(experiment);
    expect(timeline[4].experiment).toBeNull();
  });
});

describe('EXPERIMENTS', () => {
  it('has unique ids and unique months', () => {
    // Arrange
    const ids = EXPERIMENTS.map((item) => item.id);
    const months = EXPERIMENTS.map((item) => item.monthIndex);

    // Act
    const uniqueIds = new Set(ids);
    const uniqueMonths = new Set(months);

    // Assert
    expect(uniqueIds.size).toBe(ids.length);
    expect(uniqueMonths.size).toBe(months.length);
  });
});

describe('SEASON_PARTS', () => {
  it('uses the accent of each experiment, in season order', () => {
    // Arrange
    const experimentAccents = [...EXPERIMENTS]
      .sort((a, b) => a.monthIndex - b.monthIndex)
      .map((experiment) => experiment.accent);

    // Act
    const partAccents = SEASON_PARTS.map((part) => part.accent);

    // Assert
    expect(partAccents).toEqual(experimentAccents);
  });
});

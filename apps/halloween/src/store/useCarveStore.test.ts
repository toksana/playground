import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { makePoint, makeStroke } from '@/lib/carve/testFactories';
import { pickFortune } from '@/lib/fortune/hashStrokes';
import { BRUSH_SIZES, useCarveStore } from './useCarveStore';

const initialState = useCarveStore.getInitialState();

beforeEach(() => {
  useCarveStore.setState(initialState, true);
});

describe('useCarveStore', () => {
  it('starts in the intro phase with an empty mask', () => {
    const { phase, strokes, current, isShared } = useCarveStore.getState();

    expect(phase).toBe('intro');
    expect(strokes).toEqual([]);
    expect(current).toBeNull();
    expect(isShared).toBe(false);
  });

  it('changes phase', () => {
    useCarveStore.getState().setPhase('carving');

    expect(useCarveStore.getState().phase).toBe('carving');
  });

  it('begins a stroke with the current brush width', () => {
    const point = makePoint();
    useCarveStore.getState().setBrush(BRUSH_SIZES[2]);

    useCarveStore.getState().beginStroke(point);

    expect(useCarveStore.getState().current).toEqual({
      w: BRUSH_SIZES[2],
      pts: [point],
    });
  });

  it('extends the current stroke with distant points', () => {
    useCarveStore.getState().beginStroke([0.1, 0.1]);

    useCarveStore.getState().extendStroke([0.3, 0.3]);

    expect(useCarveStore.getState().current?.pts).toEqual([
      [0.1, 0.1],
      [0.3, 0.3],
    ]);
  });

  it('ignores extendStroke without a stroke in progress', () => {
    const before = useCarveStore.getState();

    useCarveStore.getState().extendStroke(makePoint());

    expect(useCarveStore.getState()).toBe(before);
  });

  it('does not bump maskVersion for a point that is too close', () => {
    useCarveStore.getState().beginStroke([0.1, 0.1]);
    const version = useCarveStore.getState().maskVersion;

    useCarveStore.getState().extendStroke([0.1001, 0.1]);

    expect(useCarveStore.getState().maskVersion).toBe(version);
  });

  it('commits a simplified stroke on endStroke', () => {
    useCarveStore.getState().beginStroke([0, 0.5]);
    [0.25, 0.5, 0.75, 1].forEach((x) =>
      useCarveStore.getState().extendStroke([x, 0.5]),
    );

    useCarveStore.getState().endStroke();

    const { strokes, current } = useCarveStore.getState();
    expect(current).toBeNull();
    expect(strokes).toHaveLength(1);
    expect(strokes[0].pts).toEqual([
      [0, 0.5],
      [1, 0.5],
    ]);
  });

  it('ignores endStroke without a stroke in progress', () => {
    useCarveStore.getState().endStroke();

    expect(useCarveStore.getState().strokes).toEqual([]);
  });

  it('undoes the last stroke only', () => {
    const [first, second] = [makeStroke(), makeStroke()];
    useCarveStore.getState().loadStrokes([first, second]);

    useCarveStore.getState().undo();

    expect(useCarveStore.getState().strokes).toEqual([first]);
  });

  it('clears all strokes and the current one', () => {
    useCarveStore.getState().loadStrokes([makeStroke()]);
    useCarveStore.getState().beginStroke(makePoint());

    useCarveStore.getState().clear();

    const { strokes, current } = useCarveStore.getState();
    expect(strokes).toEqual([]);
    expect(current).toBeNull();
  });

  it('loads strokes and marks them as shared', () => {
    const strokes = [makeStroke(), makeStroke()];

    useCarveStore.getState().loadStrokes(strokes, true);

    const state = useCarveStore.getState();
    expect(state.strokes).toEqual(strokes);
    expect(state.isShared).toBe(true);
  });

  it('bumps maskVersion on undo, clear and load', () => {
    const versions = [
      () => useCarveStore.getState().undo(),
      () => useCarveStore.getState().clear(),
      () => useCarveStore.getState().loadStrokes([]),
    ].map((action) => {
      const before = useCarveStore.getState().maskVersion;
      action();
      return useCarveStore.getState().maskVersion - before;
    });

    expect(versions).toEqual([1, 1, 1]);
  });

  it('marks a loaded template as active', () => {
    const id = faker.string.alphanumeric(8);

    useCarveStore.getState().loadTemplate(id, [makeStroke()]);

    const state = useCarveStore.getState();
    expect(state.activeTemplateId).toBe(id);
    expect(state.strokes).toHaveLength(1);
    expect(state.isShared).toBe(false);
  });

  it('clears the active template on stroke, undo, clear and load', () => {
    const actions = [
      () => useCarveStore.getState().beginStroke(makePoint()),
      () => useCarveStore.getState().undo(),
      () => useCarveStore.getState().clear(),
      () => useCarveStore.getState().loadStrokes([], true),
    ];

    const results = actions.map((action) => {
      useCarveStore.getState().loadTemplate(faker.string.alphanumeric(8), []);
      action();
      return useCarveStore.getState().activeTemplateId;
    });

    expect(results).toEqual([null, null, null, null]);
  });

  describe('template animation', () => {
    const template = [makeStroke(), makeStroke(), makeStroke()];

    it('starts from an empty mask and blocks edits', () => {
      useCarveStore.getState().loadStrokes([makeStroke()]);

      useCarveStore.getState().startTemplateAnimation();

      const state = useCarveStore.getState();
      expect(state.isAnimating).toBe(true);
      expect(state.strokes).toEqual([]);
      expect(state.activeTemplateId).toBeNull();
    });

    it('ignores user strokes while animating', () => {
      useCarveStore.getState().startTemplateAnimation();
      const before = useCarveStore.getState();

      useCarveStore.getState().beginStroke(makePoint());
      useCarveStore.getState().extendStroke(makePoint());
      useCarveStore.getState().endStroke();

      expect(useCarveStore.getState()).toBe(before);
    });

    it('keeps the strokes reference while one stroke is in progress', () => {
      useCarveStore.getState().startTemplateAnimation();
      const partial = { w: template[0].w, pts: template[0].pts.slice(0, 1) };

      useCarveStore.getState().advanceTemplateAnimation(template, 0, partial);
      const strokes = useCarveStore.getState().strokes;
      useCarveStore.getState().advanceTemplateAnimation(template, 0, partial);

      expect(useCarveStore.getState().strokes).toBe(strokes);
      expect(useCarveStore.getState().current).toBe(partial);
    });

    it('commits finished strokes as a prefix of the template', () => {
      useCarveStore.getState().startTemplateAnimation();

      useCarveStore.getState().advanceTemplateAnimation(template, 2, null);

      const { strokes, current } = useCarveStore.getState();
      expect(strokes).toEqual(template.slice(0, 2));
      expect(current).toBeNull();
    });

    it('bumps maskVersion on every advance', () => {
      useCarveStore.getState().startTemplateAnimation();
      const before = useCarveStore.getState().maskVersion;

      useCarveStore.getState().advanceTemplateAnimation(template, 1, null);

      expect(useCarveStore.getState().maskVersion).toBe(before + 1);
    });

    it('unblocks input and activates the template on loadTemplate', () => {
      const id = faker.string.alphanumeric(8);
      useCarveStore.getState().startTemplateAnimation();

      useCarveStore.getState().loadTemplate(id, template);

      const state = useCarveStore.getState();
      expect(state.isAnimating).toBe(false);
      expect(state.activeTemplateId).toBe(id);
      expect(state.strokes).toEqual(template);
    });
  });

  describe('fortune', () => {
    it('is null before the candle is lit', () => {
      expect(useCarveStore.getState().fortune).toBeNull();
    });

    it('is picked from the drawing when lighting starts', () => {
      const strokes = [makeStroke(), makeStroke()];
      useCarveStore.getState().loadStrokes(strokes);

      useCarveStore.getState().setPhase('lighting');

      expect(useCarveStore.getState().fortune).toEqual(pickFortune(strokes));
    });

    it('changes only the candle on setCandle', () => {
      useCarveStore.getState().loadStrokes([makeStroke()]);
      useCarveStore.getState().setPhase('lighting');
      const { fortuneIndex } = useCarveStore.getState().fortune!;

      useCarveStore.getState().setCandle(4);

      expect(useCarveStore.getState().fortune).toEqual({
        fortuneIndex,
        candleIndex: 4,
      });
    });

    it('ignores setCandle before the candle is lit', () => {
      useCarveStore.getState().setCandle(2);

      expect(useCarveStore.getState().fortune).toBeNull();
    });

    it('is kept in reveal and dropped when carving starts again', () => {
      useCarveStore.getState().loadStrokes([makeStroke()]);
      useCarveStore.getState().setPhase('lighting');
      const picked = useCarveStore.getState().fortune;

      useCarveStore.getState().setPhase('reveal');
      expect(useCarveStore.getState().fortune).toEqual(picked);

      useCarveStore.getState().setPhase('carving');
      expect(useCarveStore.getState().fortune).toBeNull();
    });
  });
});

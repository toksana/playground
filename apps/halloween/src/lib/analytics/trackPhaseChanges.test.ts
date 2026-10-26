import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCarveStore } from '@/store/useCarveStore';
import { trackPhaseChanges } from './trackPhaseChanges';

const initialState = useCarveStore.getInitialState();

describe('trackPhaseChanges', () => {
  beforeEach(() => {
    useCarveStore.setState(initialState, true);
  });

  it('reports the previous and the next phase', () => {
    // Arrange
    const track = vi.fn();
    const stop = trackPhaseChanges(useCarveStore, track);

    // Act
    useCarveStore.getState().setPhase('carving');
    useCarveStore.getState().setPhase('lighting');
    stop();

    // Assert
    expect(track.mock.calls).toEqual([
      ['phase_change', { from: 'intro', to: 'carving' }],
      ['phase_change', { from: 'carving', to: 'lighting' }],
    ]);
  });

  it('ignores updates that keep the phase', () => {
    // Arrange
    const track = vi.fn();
    const stop = trackPhaseChanges(useCarveStore, track);

    // Act
    useCarveStore.getState().setPhase('intro');
    stop();

    // Assert
    expect(track).not.toHaveBeenCalled();
  });

  it('stops reporting after unsubscribe', () => {
    // Arrange
    const track = vi.fn();
    const stop = trackPhaseChanges(useCarveStore, track);

    // Act
    stop();
    useCarveStore.getState().setPhase('carving');

    // Assert
    expect(track).not.toHaveBeenCalled();
  });
});

import { trackEvent } from '@playground/shared/analytics';
import type { Phase } from '@/store/useCarveStore';

interface PhaseState {
  phase: Phase;
}

type PhaseStore = {
  subscribe: (
    listener: (state: PhaseState, previous: PhaseState) => void,
  ) => () => void;
};

// Reports every phase transition. Returns the unsubscribe function.
export const trackPhaseChanges = (
  store: PhaseStore,
  track: typeof trackEvent = trackEvent,
): (() => void) =>
  store.subscribe((state, previous) => {
    if (state.phase === previous.phase) return;
    track('phase_change', { from: previous.phase, to: state.phase });
  });

import type { Mixpanel } from 'mixpanel-browser';

export type EventProps = Record<string, string | number | boolean>;

interface QueuedEvent {
  event: string;
  props?: EventProps;
}

type State =
  | { status: 'idle' }
  | { status: 'loading'; queue: QueuedEvent[] }
  | { status: 'ready'; client: Mixpanel };

// The Mixpanel project uses EU data residency: events sent to the default US
// endpoint are accepted (HTTP 200) but never show up in the project.
const API_HOST = 'https://api-eu.mixpanel.com';

let state: State = { status: 'idle' };

// Call only after consent is granted (or not required). The SDK is loaded
// lazily, so nothing reaches the network or the bundle before that point.
export const initAnalytics = async (
  token: string | undefined = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
): Promise<void> => {
  if (!token || state.status !== 'idle') return;
  const loading: State = { status: 'loading', queue: [] };
  state = loading;
  try {
    const { default: mixpanel } = await import('mixpanel-browser');
    // optOut() while the SDK was loading resets state to idle: do not start.
    if (state !== loading) return;
    mixpanel.init(token, { api_host: API_HOST, track_pageview: true });
    loading.queue.forEach(({ event, props }) => mixpanel.track(event, props));
    state = { status: 'ready', client: mixpanel };
  } catch (error) {
    state = { status: 'idle' };
    if (error instanceof Error)
      console.warn('Cannot start analytics', error.message);
  }
};

export const track = (event: string, props?: EventProps): void => {
  if (state.status === 'ready') state.client.track(event, props);
  else if (state.status === 'loading') state.queue.push({ event, props });
};

// Stops tracking and drops anything not yet sent (e.g. consent revoked).
export const optOut = (): void => {
  if (state.status === 'ready') state.client.opt_out_tracking();
  state = { status: 'idle' };
};

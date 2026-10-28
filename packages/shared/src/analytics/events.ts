import { track } from './mixpanel';
import type { EventProps } from './mixpanel';

export type ContactChannel = 'portfolio' | 'github' | 'x';

// Single catalog of analytics events. `undefined` means the event has no properties.
// Property shapes are `type` literals (not interfaces) so they fit Mixpanel's props.
export type EventMap = {
  tap_to_enter: undefined;
  phase_change: { from: string; to: string };
  template_category_click: { category: string };
  random_template_click: undefined;
  light_it_click: undefined;
  carve_again_click: undefined;
  candle_pick: { candle: string };
  share_x_click: undefined;
  playground_click: undefined;
  contact_click: { channel: ContactChannel };
  nav_click: { target: string };
  play_click: { experiment_id: string };
};

export type EventName = keyof EventMap;

type PropsArgs<E extends EventName> = EventMap[E] extends undefined
  ? []
  : [props: EventMap[E]];

// An event as plain data, so server components can hand it to client ones.
export type TrackedEvent = {
  [E in EventName]: EventMap[E] extends undefined
    ? { name: E; props?: undefined }
    : { name: E; props: EventMap[E] };
}[EventName];

export const trackEvent = <E extends EventName>(
  event: E,
  ...args: PropsArgs<E>
): void => {
  track(event, args[0] as EventProps | undefined);
};

export const trackTrackedEvent = (event: TrackedEvent): void => {
  track(event.name, event.props);
};

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackEvent, trackTrackedEvent } from './events';

const sdk = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('./mixpanel', () => ({ track: sdk.track }));

describe('trackEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards an event without properties', () => {
    // Act
    trackEvent('tap_to_enter');

    // Assert
    expect(sdk.track).toHaveBeenCalledWith('tap_to_enter', undefined);
  });

  it('forwards an event with its properties', () => {
    // Act
    trackEvent('phase_change', { from: 'intro', to: 'carving' });

    // Assert
    expect(sdk.track).toHaveBeenCalledWith('phase_change', {
      from: 'intro',
      to: 'carving',
    });
  });
});

describe('trackTrackedEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards an event described as data', () => {
    // Act
    trackTrackedEvent({ name: 'contact_click', props: { channel: 'github' } });

    // Assert
    expect(sdk.track).toHaveBeenCalledWith('contact_click', {
      channel: 'github',
    });
  });

  it('forwards a data event without properties', () => {
    // Act
    trackTrackedEvent({ name: 'playground_click' });

    // Assert
    expect(sdk.track).toHaveBeenCalledWith('playground_click', undefined);
  });
});

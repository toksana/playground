import { beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  track: vi.fn(),
  opt_out_tracking: vi.fn(),
}));

vi.mock('mixpanel-browser', () => ({ default: sdk }));

const load = async () => import('./mixpanel');

describe('analytics client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('does nothing without a token', async () => {
    // Arrange
    const { initAnalytics, track } = await load();

    // Act
    await initAnalytics(undefined);
    track('tap_to_enter');

    // Assert
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it('sends nothing before init', async () => {
    // Arrange
    const { track } = await load();

    // Act
    track('tap_to_enter');

    // Assert
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it('initialises once with automatic pageviews', async () => {
    // Arrange
    const { initAnalytics } = await load();

    // Act
    await initAnalytics('token');
    await initAnalytics('token');

    // Assert
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.init).toHaveBeenCalledWith('token', { track_pageview: true });
  });

  it('forwards events once ready', async () => {
    // Arrange
    const { initAnalytics, track } = await load();
    await initAnalytics('token');

    // Act
    track('phase_change', { from: 'intro', to: 'carving' });

    // Assert
    expect(sdk.track).toHaveBeenCalledWith('phase_change', {
      from: 'intro',
      to: 'carving',
    });
  });

  it('queues events fired while the SDK loads and flushes them in order', async () => {
    // Arrange
    const { initAnalytics, track } = await load();

    // Act
    const started = initAnalytics('token');
    track('first');
    track('second', { n: 2 });
    await started;

    // Assert
    expect(sdk.track.mock.calls).toEqual([
      ['first', undefined],
      ['second', { n: 2 }],
    ]);
  });

  it('opts out and stops forwarding events', async () => {
    // Arrange
    const { initAnalytics, track, optOut } = await load();
    await initAnalytics('token');

    // Act
    optOut();
    track('after_opt_out');

    // Assert
    expect(sdk.opt_out_tracking).toHaveBeenCalledTimes(1);
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it('does not start when opted out while the SDK is loading', async () => {
    // Arrange
    const { initAnalytics, track, optOut } = await load();

    // Act
    const started = initAnalytics('token');
    track('queued');
    optOut();
    await started;

    // Assert
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
  });
});

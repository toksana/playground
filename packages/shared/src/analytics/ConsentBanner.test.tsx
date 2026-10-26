import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AnalyticsProvider } from './AnalyticsProvider';
import { ConsentBanner } from './ConsentBanner';

describe('ConsentBanner', () => {
  it('names the app and offers both choices', () => {
    // Arrange
    const props = { appName: 'Glowkin', onAccept: vi.fn(), onDecline: vi.fn() };

    // Act
    const html = renderToStaticMarkup(<ConsentBanner {...props} />);

    // Assert
    expect(html).toContain('how Glowkin is used');
    expect(html).toContain('>Accept</button>');
    expect(html).toContain('>Decline</button>');
    expect(html).toContain('aria-label="Analytics consent"');
  });
});

describe('AnalyticsProvider', () => {
  it('renders nothing on the server, before the consent state is known', () => {
    // Act
    const html = renderToStaticMarkup(<AnalyticsProvider appName="Glowkin" />);

    // Assert
    expect(html).toBe('');
  });
});

import { HUB_URL } from '@playground/shared/links';
import { describe, expect, it } from 'vitest';
import { FORTUNES } from './fortunes';
import { buildShareText, buildShareUrl, buildXIntentUrl } from './shareUrl';

const result = { fortuneIndex: 3, candleIndex: 2 };

describe('buildShareUrl', () => {
  it('points at the public /halloween/f/<seed> route', () => {
    // Act
    const url = buildShareUrl(result);

    // Assert
    expect(url).toBe(`${HUB_URL}/halloween/f/3-2`);
  });
});

describe('buildShareText', () => {
  it('contains the fortune text', () => {
    // Act
    const text = buildShareText(result);

    // Assert
    expect(text).toContain(FORTUNES[3]);
  });
});

describe('buildXIntentUrl', () => {
  it('encodes text and url as query parameters', () => {
    // Act
    const intent = new URL(buildXIntentUrl(result));

    // Assert
    expect(intent.origin).toBe('https://x.com');
    expect(intent.pathname).toBe('/intent/post');
    expect(intent.searchParams.get('text')).toBe(buildShareText(result));
    expect(intent.searchParams.get('url')).toBe(buildShareUrl(result));
  });
});

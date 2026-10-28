import { HUB_URL } from '@playground/shared/links';
import { describe, expect, it } from 'vitest';
import { makeStroke } from '@/lib/carve/testFactories';
import { decodeDrawing } from '@/lib/share/drawingCodec';
import { FORTUNES } from './fortunes';
import { buildShareText, buildShareUrl, buildXIntentUrl } from './shareUrl';

const result = { fortuneIndex: 3, candleIndex: 2 };
const strokes = [makeStroke(), makeStroke()];
const PREFIX = `${HUB_URL}/halloween/f/`;

describe('buildShareUrl', () => {
  it('points at the public /halloween/f/<code> route', () => {
    // Act
    const url = buildShareUrl(result, strokes);

    // Assert
    expect(url.startsWith(PREFIX)).toBe(true);
    expect(url.slice(PREFIX.length)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('carries the fortune, the candle and the drawing in the code', () => {
    // Act
    const url = buildShareUrl(result, strokes);
    const decoded = decodeDrawing(url.slice(PREFIX.length));

    // Assert
    expect(decoded?.fortuneIndex).toBe(result.fortuneIndex);
    expect(decoded?.candleIndex).toBe(result.candleIndex);
    expect(decoded?.strokes).toHaveLength(strokes.length);
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
    const intent = new URL(buildXIntentUrl(result, strokes));

    // Assert
    expect(intent.origin).toBe('https://x.com');
    expect(intent.pathname).toBe('/intent/post');
    expect(intent.searchParams.get('text')).toBe(buildShareText(result));
    expect(intent.searchParams.get('url')).toBe(buildShareUrl(result, strokes));
  });
});

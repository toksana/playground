import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Overlay } from './Overlay';
import { AUTHOR_HANDLE, AUTHOR_URL, HUB_URL } from './links';

describe('Overlay', () => {
  it('links back to the hub', () => {
    // Arrange
    const expected = `<a href="${HUB_URL}" class="pg-overlay-link pg-overlay-back">← playground</a>`;

    // Act
    const html = renderToStaticMarkup(<Overlay />);

    // Assert
    expect(html).toContain(expected);
  });

  it('credits the author with an external link', () => {
    // Arrange
    const expectedHref = `href="${AUTHOR_URL}"`;

    // Act
    const html = renderToStaticMarkup(<Overlay />);

    // Assert
    expect(html).toContain(expectedHref);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(`by ${AUTHOR_HANDLE}`);
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TrackedLink } from './TrackedLink';

describe('TrackedLink', () => {
  it('renders a plain anchor and does not leak the event prop', () => {
    // Arrange
    const event = {
      name: 'nav_click',
      props: { target: 'experiments' },
    } as const;

    // Act
    const html = renderToStaticMarkup(
      <TrackedLink href="#experiments" className="link" event={event}>
        experiments
      </TrackedLink>,
    );

    // Assert
    expect(html).toBe('<a href="#experiments" class="link">experiments</a>');
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./overlay.css', import.meta.url), 'utf8');

const ruleBody = (selector: string): string =>
  css.match(
    new RegExp(`${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`),
  )?.[1] ?? '';

describe('overlay.css', () => {
  it('meets the 24px minimum touch target size', () => {
    // Arrange
    const body = ruleBody('.pg-overlay-link');

    // Act
    const minHeight = body.match(/min-height:\s*([\d.]+)rem/)?.[1];

    // Assert
    expect(Number(minHeight) * 16).toBeGreaterThanOrEqual(24);
  });
});

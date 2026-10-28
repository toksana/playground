import { describe, expect, it } from 'vitest';
import { wrapText } from './wrapText';

// One unit per character keeps the expectations readable.
const measure = (line: string): number => line.length;

describe('wrapText', () => {
  it('keeps a short text on one line', () => {
    // Arrange
    const text = 'hello world';

    // Act
    const lines = wrapText(text, 20, measure);

    // Assert
    expect(lines).toEqual(['hello world']);
  });

  it('wraps at word boundaries without exceeding the width', () => {
    // Arrange
    const text = 'the quick brown fox jumps';

    // Act
    const lines = wrapText(text, 10, measure);

    // Assert
    expect(lines).toEqual(['the quick', 'brown fox', 'jumps']);
  });

  it('puts a word longer than the width on its own line', () => {
    // Arrange
    const text = 'a supercalifragilistic b';

    // Act
    const lines = wrapText(text, 6, measure);

    // Assert
    expect(lines).toEqual(['a', 'supercalifragilistic', 'b']);
  });

  it('collapses repeated whitespace', () => {
    // Arrange
    const text = '  one   two \n three ';

    // Act
    const lines = wrapText(text, 100, measure);

    // Assert
    expect(lines).toEqual(['one two three']);
  });

  it('returns no lines for an empty text', () => {
    // Act
    const lines = wrapText('   ', 10, measure);

    // Assert
    expect(lines).toEqual([]);
  });
});

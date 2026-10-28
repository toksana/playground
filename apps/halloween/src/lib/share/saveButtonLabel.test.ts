import { describe, expect, it } from 'vitest';
import { saveButtonLabel } from './saveButtonLabel';
import type { SaveStatus } from './saveButtonLabel';

describe('saveButtonLabel', () => {
  it.each<[SaveStatus, boolean, string]>([
    ['idle', false, 'Save image'],
    ['idle', true, 'Share image'],
    ['busy', false, 'Saving…'],
    ['busy', true, 'Preparing…'],
    ['saved', false, 'Saved ✓'],
    ['shared', true, 'Shared ✓'],
    ['error', false, 'Try again'],
    ['error', true, 'Try again'],
  ])('shows the label for %s (canShare: %s)', (status, canShare, expected) => {
    // Act
    const label = saveButtonLabel(status, canShare);

    // Assert
    expect(label).toBe(expected);
  });
});

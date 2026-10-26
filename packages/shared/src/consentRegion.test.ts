import { describe, expect, it } from 'vitest';
import { isConsentRequired } from './consentRegion';

describe('isConsentRequired', () => {
  it.each(['DE', 'FR', 'PL', 'SE', 'IE'])(
    'requires consent in EU country %s',
    (country) => {
      // Act
      const result = isConsentRequired(country);

      // Assert
      expect(result).toBe(true);
    },
  );

  it.each(['NO', 'IS', 'LI'])(
    'requires consent in EEA country %s',
    (country) => {
      // Act
      const result = isConsentRequired(country);

      // Assert
      expect(result).toBe(true);
    },
  );

  it.each(['GB', 'CH'])('requires consent in %s', (country) => {
    // Act
    const result = isConsentRequired(country);

    // Assert
    expect(result).toBe(true);
  });

  it.each(['US', 'CA', 'JP', 'BR', 'AU', 'UA'])(
    'does not require consent in %s',
    (country) => {
      // Act
      const result = isConsentRequired(country);

      // Assert
      expect(result).toBe(false);
    },
  );

  it('ignores case and surrounding whitespace', () => {
    // Act
    const result = isConsentRequired(' de ');

    // Assert
    expect(result).toBe(true);
  });

  it.each([null, undefined, '', '   '])(
    'requires consent when the country is unknown (%j)',
    (country) => {
      // Act
      const result = isConsentRequired(country);

      // Assert
      expect(result).toBe(true);
    },
  );
});

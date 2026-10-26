import { describe, expect, it, vi } from 'vitest';
import {
  isConsentCookiePresent,
  readConsent,
  writeConsent,
} from './consentStorage';

const REQUIRED_COOKIE = 'theme=dark; consent-required=1';

const makeStorage = (value: string | null) => ({ getItem: vi.fn(() => value) });

describe('isConsentCookiePresent', () => {
  it('finds the cookie among others', () => {
    // Act
    const result = isConsentCookiePresent(REQUIRED_COOKIE);

    // Assert
    expect(result).toBe(true);
  });

  it.each(['', 'theme=dark', 'consent-required=0', 'x-consent-required=1'])(
    'does not match "%s"',
    (cookie) => {
      // Act
      const result = isConsentCookiePresent(cookie);

      // Assert
      expect(result).toBe(false);
    },
  );
});

describe('readConsent', () => {
  it('grants immediately when the consent cookie is absent', () => {
    // Arrange
    const storage = makeStorage('denied');

    // Act
    const result = readConsent({ cookie: 'theme=dark', storage });

    // Assert
    expect(result).toBe('granted');
    expect(storage.getItem).not.toHaveBeenCalled();
  });

  it.each(['granted', 'denied'] as const)(
    'returns the stored %s choice when consent is required',
    (choice) => {
      // Arrange
      const storage = makeStorage(choice);

      // Act
      const result = readConsent({ cookie: REQUIRED_COOKIE, storage });

      // Assert
      expect(result).toBe(choice);
    },
  );

  it.each([null, 'garbage'])(
    'is unknown when consent is required and the stored value is %j',
    (value) => {
      // Arrange
      const storage = makeStorage(value);

      // Act
      const result = readConsent({ cookie: REQUIRED_COOKIE, storage });

      // Assert
      expect(result).toBe('unknown');
    },
  );

  it('is unknown when consent is required and storage is unavailable', () => {
    // Act
    const result = readConsent({ cookie: REQUIRED_COOKIE, storage: null });

    // Assert
    expect(result).toBe('unknown');
  });

  it('is unknown and warns when storage throws', () => {
    // Arrange
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
    };

    // Act
    const result = readConsent({ cookie: REQUIRED_COOKIE, storage });

    // Assert
    expect(result).toBe('unknown');
    expect(warn).toHaveBeenCalledWith('Cannot read consent', 'blocked');
    warn.mockRestore();
  });
});

describe('writeConsent', () => {
  it('stores the choice', () => {
    // Arrange
    const storage = { setItem: vi.fn() };

    // Act
    writeConsent('granted', storage);

    // Assert
    expect(storage.setItem).toHaveBeenCalledWith('pg:consent', 'granted');
  });

  it('warns instead of throwing when storage fails', () => {
    // Arrange
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = {
      setItem: () => {
        throw new Error('quota');
      },
    };

    // Act
    writeConsent('denied', storage);

    // Assert
    expect(warn).toHaveBeenCalledWith('Cannot save consent', 'quota');
    warn.mockRestore();
  });
});

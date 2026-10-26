import { describe, expect, it, vi } from 'vitest';
import { CONSENT_COOKIE, syncConsentCookie } from './consentCookie';

const makeCookies = () => ({ set: vi.fn(), delete: vi.fn() });

describe('syncConsentCookie', () => {
  it('sets the cookie in a consent region when it is missing', () => {
    // Arrange
    const cookies = makeCookies();

    // Act
    syncConsentCookie({
      country: 'DE',
      hasCookie: false,
      cookies,
      secure: true,
    });

    // Assert
    expect(cookies.set).toHaveBeenCalledWith(CONSENT_COOKIE, '1', {
      path: '/',
      sameSite: 'lax',
      secure: true,
    });
    expect(cookies.delete).not.toHaveBeenCalled();
  });

  it('sets the cookie when the country is unknown', () => {
    // Arrange
    const cookies = makeCookies();

    // Act
    syncConsentCookie({
      country: null,
      hasCookie: false,
      cookies,
      secure: false,
    });

    // Assert
    expect(cookies.set).toHaveBeenCalledTimes(1);
  });

  it('removes the cookie outside consent regions', () => {
    // Arrange
    const cookies = makeCookies();

    // Act
    syncConsentCookie({
      country: 'US',
      hasCookie: true,
      cookies,
      secure: true,
    });

    // Assert
    expect(cookies.delete).toHaveBeenCalledWith(CONSENT_COOKIE);
    expect(cookies.set).not.toHaveBeenCalled();
  });

  it.each([
    { country: 'FR', hasCookie: true },
    { country: 'US', hasCookie: false },
  ])(
    'does nothing when state already matches (%j)',
    ({ country, hasCookie }) => {
      // Arrange
      const cookies = makeCookies();

      // Act
      syncConsentCookie({ country, hasCookie, cookies, secure: true });

      // Assert
      expect(cookies.set).not.toHaveBeenCalled();
      expect(cookies.delete).not.toHaveBeenCalled();
    },
  );
});

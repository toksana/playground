import { isConsentRequired } from './consentRegion';

export const CONSENT_COOKIE = 'consent-required';
export const COUNTRY_HEADER = 'x-vercel-ip-country';

interface CookieOptions {
  path: string;
  sameSite: 'lax';
  secure: boolean;
}

// Structural subset of Next's ResponseCookies, so shared does not depend on next.
export interface ResponseCookiesLike {
  set: (name: string, value: string, options: CookieOptions) => unknown;
  delete: (name: string) => unknown;
}

interface SyncConsentCookieInput {
  country: string | null | undefined;
  hasCookie: boolean;
  cookies: ResponseCookiesLike;
  secure: boolean;
}

// Sets the cookie in consent regions and removes it elsewhere. Touches the
// response only when the state changes, so repeat visits get no Set-Cookie.
export const syncConsentCookie = ({
  country,
  hasCookie,
  cookies,
  secure,
}: SyncConsentCookieInput): void => {
  const required = isConsentRequired(country);
  if (required && !hasCookie) {
    cookies.set(CONSENT_COOKIE, '1', { path: '/', sameSite: 'lax', secure });
  } else if (!required && hasCookie) {
    cookies.delete(CONSENT_COOKIE);
  }
};

import { CONSENT_COOKIE } from '../consentCookie';

export type Consent = 'granted' | 'denied' | 'unknown';

const KEY = 'pg:consent';

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

const defaultStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const defaultCookie = (): string =>
  typeof document === 'undefined' ? '' : document.cookie;

// proxy.ts sets this cookie only where consent is legally required.
export const isConsentCookiePresent = (
  cookie: string = defaultCookie(),
): boolean =>
  cookie.split(';').some((part) => part.trim() === `${CONSENT_COOKIE}=1`);

interface ReadConsentOptions {
  cookie?: string;
  storage?: ReadableStorage | null;
}

// No consent cookie means no consent is required, so tracking starts right away.
export const readConsent = ({
  cookie = defaultCookie(),
  storage = defaultStorage(),
}: ReadConsentOptions = {}): Consent => {
  if (!isConsentCookiePresent(cookie)) return 'granted';
  try {
    const stored = storage?.getItem(KEY);
    return stored === 'granted' || stored === 'denied' ? stored : 'unknown';
  } catch (error) {
    if (error instanceof Error)
      console.warn('Cannot read consent', error.message);
    return 'unknown';
  }
};

export const writeConsent = (
  consent: Exclude<Consent, 'unknown'>,
  storage: WritableStorage | null = defaultStorage(),
): void => {
  try {
    storage?.setItem(KEY, consent);
  } catch (error) {
    if (error instanceof Error)
      console.warn('Cannot save consent', error.message);
  }
};

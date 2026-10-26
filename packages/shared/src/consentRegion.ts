// EU (27) + EEA (NO, IS, LI) + GB + CH: countries where analytics needs prior consent.
const CONSENT_COUNTRIES: ReadonlySet<string> = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'NO',
  'IS',
  'LI',
  'GB',
  'CH',
]);

// An unknown country (VPN, Tor, missing header) counts as "consent required".
export const isConsentRequired = (
  country: string | null | undefined,
): boolean => {
  const code = country?.trim().toUpperCase();
  if (!code) return true;
  return CONSENT_COUNTRIES.has(code);
};

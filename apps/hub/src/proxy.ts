import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  CONSENT_COOKIE,
  COUNTRY_HEADER,
  syncConsentCookie,
} from '@playground/shared/consentCookie';

export const proxy = (request: NextRequest): NextResponse => {
  const response = NextResponse.next();
  syncConsentCookie({
    country: request.headers.get(COUNTRY_HEADER),
    hasCookie: request.cookies.has(CONSENT_COOKIE),
    cookies: response.cookies,
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
};

// Pages only: skip _next/, api/ and anything with a file extension.
export const config = {
  matcher: ['/', '/((?!_next/|api/|.*\\..*).+)'],
};

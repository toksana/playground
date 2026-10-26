'use client';

import { useEffect } from 'react';
import { ConsentBanner } from './ConsentBanner';
import { initAnalytics, optOut } from './mixpanel';
import { chooseConsent, useConsent } from './useConsent';

interface AnalyticsProviderProps {
  appName: string;
}

export const AnalyticsProvider = ({ appName }: AnalyticsProviderProps) => {
  const consent = useConsent();

  useEffect(() => {
    if (consent === 'granted') void initAnalytics();
    if (consent === 'denied') optOut();
  }, [consent]);

  if (consent !== 'unknown') return null;
  return (
    <ConsentBanner
      appName={appName}
      onAccept={() => chooseConsent('granted')}
      onDecline={() => chooseConsent('denied')}
    />
  );
};

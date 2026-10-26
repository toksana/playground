import { useSyncExternalStore } from 'react';
import { readConsent, writeConsent } from './consentStorage';
import type { Consent } from './consentStorage';

type Choice = Exclude<Consent, 'unknown'>;

// 'pending' is the server/hydration snapshot: nothing is rendered or tracked yet.
export type ConsentSnapshot = Consent | 'pending';

const listeners = new Set<() => void>();

// Keeps the choice for this page view when localStorage is unavailable,
// so the banner still closes.
let sessionChoice: Choice | null = null;

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const chooseConsent = (choice: Choice): void => {
  sessionChoice = choice;
  writeConsent(choice);
  listeners.forEach((listener) => listener());
};

const getSnapshot = (): ConsentSnapshot => sessionChoice ?? readConsent();

export const useConsent = (): ConsentSnapshot =>
  useSyncExternalStore(subscribe, getSnapshot, () => 'pending');

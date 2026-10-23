const KEY = 'glowkin:muted';

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

const defaultStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const readMuted = (
  storage: ReadableStorage | null = defaultStorage(),
): boolean => {
  try {
    return storage?.getItem(KEY) === '1';
  } catch (error) {
    if (error instanceof Error)
      console.warn('Cannot read mute setting', error.message);
    return false;
  }
};

export const writeMuted = (
  muted: boolean,
  storage: WritableStorage | null = defaultStorage(),
): void => {
  try {
    storage?.setItem(KEY, muted ? '1' : '0');
  } catch (error) {
    if (error instanceof Error)
      console.warn('Cannot save mute setting', error.message);
  }
};

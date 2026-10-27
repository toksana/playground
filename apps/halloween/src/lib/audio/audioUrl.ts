import { assetPath } from '@/lib/basePath';

// Third-party (Pixabay) tracks are not committed. They are served from Vercel Blob when
// NEXT_PUBLIC_AUDIO_BASE_URL is set, and read from public/audio otherwise (local dev).
export const audioBaseUrl = (): string | undefined => {
  const base = process.env.NEXT_PUBLIC_AUDIO_BASE_URL;
  if (base === undefined || base === '') return undefined;
  return base.replace(/\/+$/, '');
};

export const remoteAudioPath = (file: string): string => {
  const base = audioBaseUrl();
  return base === undefined ? assetPath(`/audio/${file}`) : `${base}/${file}`;
};

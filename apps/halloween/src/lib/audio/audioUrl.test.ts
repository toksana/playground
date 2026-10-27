import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assetPath } from '@/lib/basePath';
import { audioBaseUrl, remoteAudioPath } from './audioUrl';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('remoteAudioPath', () => {
  it('falls back to the local public/audio path when no base URL is set', () => {
    const file = `${faker.word.noun()}.mp3`;
    vi.stubEnv('NEXT_PUBLIC_AUDIO_BASE_URL', '');

    const result = remoteAudioPath(file);

    expect(result).toBe(assetPath(`/audio/${file}`));
  });

  it('joins the base URL and the file name', () => {
    const base = faker.internet.url({ appendSlash: false });
    const file = `${faker.word.noun()}.mp3`;
    vi.stubEnv('NEXT_PUBLIC_AUDIO_BASE_URL', base);

    const result = remoteAudioPath(file);

    expect(result).toBe(`${base}/${file}`);
  });

  it('does not double the slash when the base URL ends with one', () => {
    const base = faker.internet.url({ appendSlash: false });
    const file = `${faker.word.noun()}.mp3`;
    vi.stubEnv('NEXT_PUBLIC_AUDIO_BASE_URL', `${base}/`);

    const result = remoteAudioPath(file);

    expect(result).toBe(`${base}/${file}`);
  });
});

describe('audioBaseUrl', () => {
  it('is undefined when the variable is not set', () => {
    vi.stubEnv('NEXT_PUBLIC_AUDIO_BASE_URL', '');

    const result = audioBaseUrl();

    expect(result).toBeUndefined();
  });
});

import { HUB_URL } from '@playground/shared/links';
import { BASE_PATH } from '@/lib/basePath';
import { FORTUNES } from './fortunes';
import type { FortuneResult } from './seed';
import { encodeSeed } from './seed';

export const buildShareUrl = (result: FortuneResult): string =>
  `${HUB_URL}${BASE_PATH}/f/${encodeSeed(result)}`;

export const buildShareText = ({ fortuneIndex }: FortuneResult): string =>
  `🎃 "${FORTUNES[fortuneIndex]}"\n\nMy pumpkin told my fortune.`;

export const buildXIntentUrl = (result: FortuneResult): string => {
  const text = encodeURIComponent(buildShareText(result));
  const url = encodeURIComponent(buildShareUrl(result));
  return `https://x.com/intent/post?text=${text}&url=${url}`;
};

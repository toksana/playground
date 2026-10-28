import { ImageResponse } from 'next/og';
import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';
import { FortuneImage } from './FortuneImage';
import { decodeSeed } from './seed';

export const FORTUNE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// Shared by the Open Graph and Twitter image routes. A bad seed gets a plain 404.
export const fortuneImageResponse = async (
  params: Promise<{ seed: string }>,
): Promise<Response> => {
  const { seed } = await params;
  const result = decodeSeed(seed);
  if (result === null) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    <FortuneImage
      text={FORTUNES[result.fortuneIndex]}
      color={CANDLES[result.candleIndex].color}
    />,
    FORTUNE_IMAGE_SIZE,
  );
};

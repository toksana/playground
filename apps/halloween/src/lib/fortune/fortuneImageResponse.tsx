import { ImageResponse } from 'next/og';
import { parseShareParam } from '@/lib/share/shareLink';
import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';
import { FortuneImage } from './FortuneImage';


export const FORTUNE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// A drawing code never changes what it renders, so the image can be cached for good.
const IMMUTABLE = 'public, max-age=31536000, s-maxage=31536000, immutable';

// Serves both link formats. A bad link gets a plain 404.
export const fortuneImageResponse = async (
  params: Promise<{ seed: string }>,
): Promise<Response> => {
  const { seed } = await params;
  const data = parseShareParam(seed);
  if (data === null) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <FortuneImage
        text={FORTUNES[data.fortuneIndex]}
        color={CANDLES[data.candleIndex].color}
        strokes={data.strokes ?? undefined}
      />
    ),
    {
      ...FORTUNE_IMAGE_SIZE,
      headers: data.strokes === null ? {} : { 'Cache-Control': IMMUTABLE },
    },
  );
};

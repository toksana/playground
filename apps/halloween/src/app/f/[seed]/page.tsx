import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PumpkinGlyph } from '@/components/PumpkinGlyph';
import { BASE_PATH } from '@/lib/basePath';
import { CANDLES } from '@/lib/fortune/candles';
import { FORTUNE_IMAGE_SIZE } from '@/lib/fortune/fortuneImageResponse';
import { FORTUNES } from '@/lib/fortune/fortunes';
import { allSeeds } from '@/lib/fortune/seed';
import { parseShareParam } from '@/lib/share/shareLink';

// Shared links arrive from outside the app, so this page is never a navigation target worth
// validating as instant. Old "<fortune>-<candle>" links are prerendered, drawing codes render on demand.
export const instant = false;

const IMAGE_ALT = 'A glowing carved pumpkin and the fortune it told';

export const generateStaticParams = () => allSeeds().map((seed) => ({ seed }));

// An unknown link renders the not-found UI (with noindex); only hand-made URLs get there.
const resolveSeed = async (params: PageProps<'/f/[seed]'>['params']) => {
  const { seed } = await params;
  const data = parseShareParam(seed);
  if (data === null) notFound();
  return {
    seed,
    text: FORTUNES[data.fortuneIndex],
    candle: CANDLES[data.candleIndex],
    strokes: data.strokes ?? undefined,
  };
};

export async function generateMetadata({
  params,
}: PageProps<'/f/[seed]'>): Promise<Metadata> {
  const { seed, text } = await resolveSeed(params);
  const title = 'My pumpkin told my fortune';
  const images = [
    { url: `${BASE_PATH}/f/${seed}/og`, ...FORTUNE_IMAGE_SIZE, alt: IMAGE_ALT },
  ];

  return {
    title,
    description: text,
    openGraph: {
      title,
      description: text,
      url: `${BASE_PATH}/f/${seed}`,
      images,
    },
    twitter: { card: 'summary_large_image', title, description: text, images },
  };
}

export default async function FortunePage({ params }: PageProps<'/f/[seed]'>) {
  const { text, candle, strokes } = await resolveSeed(params);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#05060c] px-6 py-10">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <PumpkinGlyph color={candle.color} width={260} strokes={strokes} />
        <p
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: candle.color }}
        >
          Your pumpkin tells your fortune
        </p>
        <p className="text-2xl leading-snug font-semibold text-balance text-orange-50">
          {text}
        </p>
        <Link
          href="/"
          className="grid h-12 place-items-center rounded-full border border-orange-300 bg-orange-500/25 px-8 text-orange-100 transition-colors hover:bg-orange-500/35"
        >
          Carve your own pumpkin
        </Link>
      </div>
    </main>
  );
}

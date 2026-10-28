import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';

export interface FortuneResult {
  fortuneIndex: number;
  candleIndex: number;
}

// "<fortuneIndex>-<candleIndex>", e.g. "7-2".
export const encodeSeed = ({
  fortuneIndex,
  candleIndex,
}: FortuneResult): string => `${fortuneIndex}-${candleIndex}`;

const SEED_PATTERN = /^(\d{1,3})-(\d{1,2})$/;

// Returns null for anything that is not the canonical encoding of an existing fortune and candle.
export const decodeSeed = (seed: string): FortuneResult | null => {
  const match = SEED_PATTERN.exec(seed);
  if (match === null) return null;

  const result = {
    fortuneIndex: Number(match[1]),
    candleIndex: Number(match[2]),
  };
  const isKnown =
    result.fortuneIndex < FORTUNES.length &&
    result.candleIndex < CANDLES.length;
  return isKnown && encodeSeed(result) === seed ? result : null;
};

export const allSeeds = (): string[] =>
  FORTUNES.flatMap((_, fortuneIndex) =>
    CANDLES.map((_, candleIndex) => encodeSeed({ fortuneIndex, candleIndex })),
  );

import { PumpkinGlyph } from '@/components/PumpkinGlyph';
import type { Stroke } from '@/lib/carve/strokes';

interface FortuneImageProps {
  text: string;
  color: string;
  // The carved face; old links have none and get a generic one.
  strokes?: Stroke[];
}

const hexToRgba = (hex: string, alpha: number): string => {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Longer fortunes get a smaller font so they still fit the text column in 3-4 lines.
const fontSizeFor = (text: string): number => (text.length <= 48 ? 60 : 52);

// 1200x630 social card. Only flexbox and inline styles: this is rendered by `next/og` (Satori).
export const FortuneImage = ({ text, color, strokes }: FortuneImageProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: '0 72px',
      background: `radial-gradient(circle at 27% 52%, ${hexToRgba(color, 0.28)} 0%, ${hexToRgba(color, 0)} 55%)`,
      backgroundColor: '#05060c',
      color: '#fff7ed',
    }}
  >
    <div style={{ display: 'flex', width: 440 }}>
      <PumpkinGlyph color={color} width={440} strokes={strokes} />
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginLeft: 56,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color,
        }}
      >
        Your pumpkin tells your fortune
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 28,
          fontSize: fontSizeFor(text),
          lineHeight: 1.2,
          fontWeight: 700,
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 40,
          fontSize: 24,
          color: 'rgba(255, 247, 237, 0.55)',
        }}
      >
        Glowkin · playground.oksana.dev/halloween
      </div>
    </div>
  </div>
);

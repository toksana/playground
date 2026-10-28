interface PumpkinGlyphProps {
  // Colour of the candle light shining through the carved face.
  color: string;
  width: number;
}

const BODY = [
  { cx: 108, rx: 96, fill: '#8f3a05' },
  { cx: 292, rx: 96, fill: '#8f3a05' },
  { cx: 150, rx: 92, fill: '#b94f08' },
  { cx: 250, rx: 92, fill: '#b94f08' },
  { cx: 200, rx: 86, fill: '#d9650c' },
] as const;

const FACE = [
  '120,170 172,170 146,122',
  '228,170 280,170 254,122',
  '190,208 210,208 200,186',
] as const;

const MOUTH =
  'M108 238 L148 254 L174 236 L200 258 L226 236 L252 254 L292 238 Q274 304 200 308 Q126 304 108 238 Z';

// Glow is faked with wide, faint strokes: SVG filters are not supported by `next/og`.
const FACE_LAYERS = [
  { width: 34, opacity: 0.1, solid: false },
  { width: 20, opacity: 0.18, solid: false },
  { width: 9, opacity: 0.3, solid: false },
  { width: 4, opacity: 1, solid: true },
] as const;

// A plain function, not a component: Satori only accepts intrinsic elements inside <svg>.
const faceLayers = (color: string) =>
  FACE_LAYERS.map(({ width, opacity, solid }) => (
    <g
      key={width}
      fill={solid ? color : 'none'}
      stroke={color}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinejoin="round"
    >
      {FACE.map((points) => (
        <polygon key={points} points={points} />
      ))}
      <path d={MOUTH} />
    </g>
  ));

// Plain SVG with no CSS, so it renders both in the page and inside `next/og`.
export const PumpkinGlyph = ({ color, width }: PumpkinGlyphProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={(width * 360) / 400}
    viewBox="0 0 400 360"
  >
    {BODY.map(({ cx, rx, fill }) => (
      <ellipse key={cx} cx={cx} cy={205} rx={rx} ry={138} fill={fill} />
    ))}
    <path
      d="M188 76 C188 56 204 44 214 30 L234 38 C224 52 222 64 224 80 Z"
      fill="#3b2a12"
    />
    {faceLayers(color)}
  </svg>
);

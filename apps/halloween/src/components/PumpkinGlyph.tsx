interface PumpkinGlyphProps {
  // Colour of the candle light shining through the carved face.
  color: string;
  width: number;
}

// Dark like the 3D scene: the pumpkin is only lit from inside, through the face.
const BODY = [
  { cx: 108, rx: 96, fill: '#1c0b04' },
  { cx: 292, rx: 96, fill: '#1c0b04' },
  { cx: 150, rx: 92, fill: '#2b1207' },
  { cx: 250, rx: 92, fill: '#2b1207' },
  { cx: 200, rx: 86, fill: '#3a1909' },
] as const;

const FACE = [
  '120,170 172,170 146,122',
  '228,170 280,170 254,122',
  '190,208 210,208 200,186',
] as const;

const MOUTH =
  'M108 238 L148 254 L174 236 L200 258 L226 236 L252 254 L292 238 Q274 304 200 308 Q126 304 108 238 Z';

// A plain function, not a component: Satori only accepts intrinsic elements inside <svg>.
const faceGroup = (id: string, color: string, filter?: string) => (
  <g
    key={id}
    fill={color}
    stroke={color}
    strokeWidth={4}
    strokeLinejoin="round"
    filter={filter}
  >
    {FACE.map((points) => (
      <polygon key={points} points={points} />
    ))}
    <path d={MOUTH} />
  </g>
);

// Plain SVG with no CSS, so it renders both in the page and inside `next/og`.
export const PumpkinGlyph = ({ color, width }: PumpkinGlyphProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={(width * 360) / 400}
    viewBox="0 0 400 360"
  >
    <defs>
      <radialGradient
        id="pumpkin-light"
        gradientUnits="userSpaceOnUse"
        cx="200"
        cy="225"
        r="190"
      >
        <stop offset="0" stopColor={color} stopOpacity="0.32" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <filter
        id="pumpkin-glow-wide"
        x="-40%"
        y="-40%"
        width="180%"
        height="180%"
      >
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter
        id="pumpkin-glow-tight"
        x="-40%"
        y="-40%"
        width="180%"
        height="180%"
      >
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
    {BODY.map(({ cx, rx, fill }) => (
      <ellipse key={cx} cx={cx} cy={205} rx={rx} ry={138} fill={fill} />
    ))}
    <ellipse cx={200} cy={205} rx={188} ry={136} fill="url(#pumpkin-light)" />
    <path
      d="M188 76 C188 56 204 44 214 30 L234 38 C224 52 222 64 224 80 Z"
      fill="#17110a"
    />
    {faceGroup('wide', color, 'url(#pumpkin-glow-wide)')}
    {faceGroup('tight', color, 'url(#pumpkin-glow-tight)')}
    {faceGroup('solid', color)}
  </svg>
);

import type { Stroke } from '@/lib/carve/strokes';

interface PumpkinGlyphProps {
  // Colour of the candle light shining through the carved face.
  color: string;
  width: number;
  // The carved face. Without it (old links) a generic face is drawn.
  strokes?: Stroke[];
}

// Dark like the 3D scene: the pumpkin is only lit from inside, through the face.
const BODY = [
  { cx: 108, rx: 96, fill: '#1c0b04' },
  { cx: 292, rx: 96, fill: '#1c0b04' },
  { cx: 150, rx: 92, fill: '#2b1207' },
  { cx: 250, rx: 92, fill: '#2b1207' },
  { cx: 200, rx: 86, fill: '#3a1909' },
] as const;

// The carve plane (u, v in 0..1) maps onto this square in the middle of the body, in the same
// proportion as the 3D pumpkin, so a face sits on the SVG body where it sits on the real one.
const FACE_SIDE = 370;
const FACE_X = 15;
const FACE_Y = 26;

const LEGACY_FACE = [
  '120,170 172,170 146,122',
  '228,170 280,170 254,122',
  '190,208 210,208 200,186',
] as const;

const LEGACY_MOUTH =
  'M108 238 L148 254 L174 236 L200 258 L226 236 L252 254 L292 238 Q274 304 200 308 Q126 304 108 238 Z';

const tenth = (value: number): number => Math.round(value * 10) / 10;

const toPoints = (stroke: Stroke): string =>
  stroke.pts
    .map(
      ([u, v]) =>
        `${tenth(FACE_X + u * FACE_SIDE)},${tenth(FACE_Y + (1 - v) * FACE_SIDE)}`,
    )
    .join(' ');

// All the helpers below are plain functions, not components: Satori only accepts intrinsic
// elements inside <svg>.
const strokeShape = (stroke: Stroke, index: number, color: string) => {
  const lineWidth = tenth(stroke.w * FACE_SIDE);

  if (stroke.fill === true && stroke.pts.length >= 3)
    return (
      <polygon
        key={index}
        points={toPoints(stroke)}
        fill={color}
        stroke={color}
        strokeWidth={lineWidth}
        strokeLinejoin="round"
      />
    );

  if (stroke.pts.length === 1) {
    const [u, v] = stroke.pts[0];
    return (
      <circle
        key={index}
        cx={tenth(FACE_X + u * FACE_SIDE)}
        cy={tenth(FACE_Y + (1 - v) * FACE_SIDE)}
        r={tenth(lineWidth / 2)}
        fill={color}
      />
    );
  }

  return (
    <polyline
      key={index}
      points={toPoints(stroke)}
      fill="none"
      stroke={color}
      strokeWidth={lineWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

const legacyShapes = (color: string) => [
  ...LEGACY_FACE.map((points) => (
    <polygon
      key={points}
      points={points}
      fill={color}
      stroke={color}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  )),
  <path
    key="mouth"
    d={LEGACY_MOUTH}
    fill={color}
    stroke={color}
    strokeWidth={4}
    strokeLinejoin="round"
  />,
];

const faceShapes = (color: string, strokes?: Stroke[]) =>
  strokes === undefined
    ? legacyShapes(color)
    : strokes.map((stroke, i) => strokeShape(stroke, i, color));

// Clipped to the body first, then blurred, so the glow may spill out but a stroke never does.
const faceLayer = (
  id: string,
  shapes: ReturnType<typeof faceShapes>,
  filter?: string,
) => (
  <g key={id} filter={filter}>
    <g clipPath="url(#pumpkin-body)">{shapes}</g>
  </g>
);

// Plain SVG with no CSS, so it renders both in the page and inside `next/og`.
export const PumpkinGlyph = ({ color, width, strokes }: PumpkinGlyphProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={(width * 360) / 400}
    viewBox="0 0 400 360"
  >
    <defs>
      <clipPath id="pumpkin-body">
        {BODY.map(({ cx, rx }) => (
          <ellipse key={cx} cx={cx} cy={205} rx={rx} ry={138} />
        ))}
      </clipPath>
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
    {faceLayer('wide', faceShapes(color, strokes), 'url(#pumpkin-glow-wide)')}
    {faceLayer('tight', faceShapes(color, strokes), 'url(#pumpkin-glow-tight)')}
    {faceLayer('solid', faceShapes(color, strokes))}
  </svg>
);

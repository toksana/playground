import type { Stroke } from '@/lib/carve/strokes';
import {
  THUMB_CENTER,
  THUMB_RADIUS,
  THUMB_SCALE,
  THUMB_VIEW_BOX,
  toThumbPoints,
} from '@/lib/carve/thumbnail';

interface TemplateThumbProps {
  strokes: Stroke[];
  size?: number;
}

const LIT = '#ffcf7a';

// Mini preview drawn from the template's own strokes, so it always matches the carving.
export const TemplateThumb = ({ strokes, size = 56 }: TemplateThumbProps) => (
  <svg
    viewBox={THUMB_VIEW_BOX}
    width={size}
    height={size}
    aria-hidden="true"
    className="shrink-0"
  >
    <circle
      cx={THUMB_CENTER}
      cy={THUMB_CENTER}
      r={THUMB_RADIUS}
      fill="#3a1a06"
    />
    {strokes.map((stroke, i) => {
      const common = {
        points: toThumbPoints(stroke.pts),
        stroke: LIT,
        strokeWidth: stroke.w * THUMB_SCALE,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
      };
      return stroke.fill === true ? (
        <polygon key={i} {...common} fill={LIT} />
      ) : (
        <polyline key={i} {...common} fill="none" />
      );
    })}
  </svg>
);

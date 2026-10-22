import { create } from 'zustand';
import { appendPoint, simplifyPoints } from '@/lib/carve/strokes';
import type { Point, Stroke } from '@/lib/carve/strokes';

export type Phase = 'intro' | 'carving' | 'lighting' | 'reveal';

export const BRUSH_SIZES = [0.015, 0.03, 0.05] as const;

interface CarveState {
  phase: Phase;
  strokes: Stroke[];
  current: Stroke | null;
  brush: number;
  // Incremented on every change to the mask content; the mask texture re-uploads on change.
  maskVersion: number;
  isShared: boolean;
  setPhase: (phase: Phase) => void;
  setBrush: (brush: number) => void;
  beginStroke: (uv: Point) => void;
  extendStroke: (uv: Point) => void;
  endStroke: () => void;
  undo: () => void;
  clear: () => void;
  loadStrokes: (strokes: Stroke[], isShared?: boolean) => void;
}

export const useCarveStore = create<CarveState>()((set) => ({
  phase: 'intro',
  strokes: [],
  current: null,
  brush: BRUSH_SIZES[1],
  maskVersion: 0,
  isShared: false,
  setPhase: (phase) => set({ phase }),
  setBrush: (brush) => set({ brush }),
  beginStroke: (uv) =>
    set((s) => ({
      current: { w: s.brush, pts: [uv] },
      maskVersion: s.maskVersion + 1,
    })),
  extendStroke: (uv) =>
    set((s) => {
      if (s.current === null) return s;
      const next = appendPoint(s.current, uv);
      if (next === s.current) return s;
      return { current: next, maskVersion: s.maskVersion + 1 };
    }),
  endStroke: () =>
    set((s) => {
      if (s.current === null) return s;
      const finished = { ...s.current, pts: simplifyPoints(s.current.pts) };
      return {
        strokes: [...s.strokes, finished],
        current: null,
        maskVersion: s.maskVersion + 1,
      };
    }),
  undo: () =>
    set((s) => ({
      strokes: s.strokes.slice(0, -1),
      current: null,
      maskVersion: s.maskVersion + 1,
    })),
  clear: () =>
    set((s) => ({
      strokes: [],
      current: null,
      maskVersion: s.maskVersion + 1,
    })),
  loadStrokes: (strokes, isShared = false) =>
    set((s) => ({
      strokes,
      current: null,
      isShared,
      maskVersion: s.maskVersion + 1,
    })),
}));

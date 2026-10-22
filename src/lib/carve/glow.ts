import type { Phase } from '@/store/useCarveStore';

// Mutable glow level (0..1) read every frame; a ref-like object so it never re-renders React.
export interface GlowRef {
  current: number;
}

// Where the glow is heading in a given phase.
export const glowTarget = (phase: Phase): number =>
  phase === 'lighting' || phase === 'reveal' ? 1 : 0;

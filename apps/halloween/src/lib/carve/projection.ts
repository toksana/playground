// Shared by the carve shader and the pointer handlers (see PLAN.md 5.2).
// The shader receives these as uniforms; never duplicate the numbers in GLSL.
export const CARVE_EXTENT = 0.85;
export const FRONT_THRESHOLD = 0.25;

// Planar projection of a local-space position onto the 0..1 mask UV square.
// GLSL equivalent: `p.xy / uExtent * 0.5 + 0.5`.
export const localToCarveUV = (x: number, y: number): [number, number] => [
  (x / CARVE_EXTENT) * 0.5 + 0.5,
  (y / CARVE_EXTENT) * 0.5 + 0.5,
];

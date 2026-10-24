// Wing flap for BatsMaterial (three-custom-shader-material over MeshBasicMaterial).
// The shape is flat in XY; both wings are lifted towards -Z by the same angle, the body stays put.
export const batsVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFlapSpeed;
  uniform float uFlapAmount;

  attribute float aPhase;

  void main() {
    float wing = smoothstep(0.06, 0.2, abs(position.x));
    float angle = sin(uTime * uFlapSpeed + aPhase) * uFlapAmount * wing;
    csm_Position = vec3(
      position.x * cos(angle),
      position.y,
      -abs(position.x) * sin(angle)
    );
  }
`;

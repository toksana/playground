// Fragment/vertex code for CarveMaterial (three-custom-shader-material over MeshStandardMaterial).
// Extent, front threshold and glow come in as uniforms from `lib/carve`.
export const carveVertexShader = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vLocalNormal;

  void main() {
    vLocalPos = position;
    vLocalNormal = normal;
  }
`;

export const carveFragmentShader = /* glsl */ `
  uniform sampler2D uMask;
  uniform float uExtent;
  uniform float uFront;
  uniform float uGlow;
  uniform vec3 uGlowColor;

  varying vec3 vLocalPos;
  varying vec3 vLocalNormal;

  void main() {
    float mask = 0.0;
    if (vLocalNormal.z > uFront) {
      vec2 uv = vLocalPos.xy / uExtent * 0.5 + 0.5;
      mask = texture2D(uMask, uv).r;
    }

    if (mask > 0.55) discard;

    // CSM overwrites diffuseColor after color_fragment, so reapply the vertex colors.
    #ifdef USE_COLOR
      csm_DiffuseColor.rgb *= vColor.rgb;
    #endif

    float edge = smoothstep(0.15, 0.55, mask);
    csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, vec3(1.0, 0.85, 0.55), edge);
    csm_Emissive = uGlowColor * edge * uGlow * 3.0;
  }
`;

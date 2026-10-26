// Spark simulation lives entirely in the vertex shader: p = v*t + g*t²/2, t = uTime - uStart.
export const sparksVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uStart;
  uniform float uScale;
  uniform vec3 uGravity;

  attribute vec3 aOrigin;
  attribute vec3 aVelocity;
  attribute float aDelay;
  attribute float aLifetime;
  attribute float aSize;

  varying float vFade;

  void main() {
    float t = uTime - uStart - aDelay;
    float remaining = 1.0 - t / aLifetime;
    vFade = (t < 0.0 || remaining < 0.0) ? 0.0 : remaining * remaining;

    vec3 offset = aOrigin + aVelocity * t + 0.5 * uGravity * t * t;
    vec4 mv = modelViewMatrix * vec4(offset, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = vFade > 0.0 ? aSize * uScale / -mv.z : 0.0;
  }
`;

export const sparksFragmentShader = /* glsl */ `
  uniform vec3 uColorHot;
  uniform vec3 uColorCool;

  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0 || vFade <= 0.0) discard;
    float core = pow(1.0 - d, 2.0);
    vec3 color = mix(uColorCool, uColorHot, vFade);
    gl_FragColor = vec4(color * 3.0 * core, core * vFade);
  }
`;

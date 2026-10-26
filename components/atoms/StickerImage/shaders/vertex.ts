const vertexShader = /* glsl */ `
  uniform vec2 uSize;
  // Length of paper (px) lifted from each edge. Both can be active at once
  // (e.g. a scroll peel on the top while the reveal unrolls the bottom).
  uniform float uPeelTop;
  uniform float uPeelBottom;
  uniform float uRadius;
  // Slope of the curl axis (dy per dx): a non-zero tilt makes one corner
  // lift first instead of the whole edge at once, which reads as paper.
  uniform float uTilt;
  // Radius gained per full turn, so a fully rolled sticker spirals instead
  // of folding every layer onto the exact same cylinder (z-fighting).
  uniform float uLayerGap;

  uniform float uIsShadow;
  uniform vec2 uShadowOffset;
  uniform float uShadowLift;

  varying vec2 vUv;
  varying float vRoll;

  const float PI = 3.141592653589793;

  // Wraps the part of the sheet past 'axis' around a cylinder lying on the
  // surface. 'side' is +1 for the top edge, -1 for the bottom one.
  vec3 rollAround(vec3 p, float axis, float side) {
    float d = (p.y - axis) * side;
    if (d <= 0.0) return p;

    float theta = d / uRadius;
    float r = uRadius + (theta / (2.0 * PI)) * uLayerGap;
    vRoll = min(theta / PI, 1.0);

    return vec3(
      p.x,
      axis + side * r * sin(theta),
      uRadius - r * cos(theta)
    );
  }

  void main() {
    vUv = uv;
    vRoll = 0.0;

    vec3 p = position;
    vec2 halfSize = uSize * 0.5;
    // The tilted axis is offset by its own span so that, at zero peel, it
    // sits entirely outside the sheet instead of already cutting a corner.
    float tiltSpan = abs(uTilt) * halfSize.x;

    float axisTop = halfSize.y - uPeelTop + uTilt * p.x + tiltSpan;
    float axisBottom = -halfSize.y + uPeelBottom - uTilt * p.x - tiltSpan;

    if (p.y > axisTop) {
      p = rollAround(p, axisTop, 1.0);
    } else if (p.y < axisBottom) {
      p = rollAround(p, axisBottom, -1.0);
    }

    if (uIsShadow > 0.5) {
      // Flat, hard-edged shadow projected on the page: lifted parts cast it
      // further away, like the offset shadow of the site's buttons.
      vec2 offset = uShadowOffset + vec2(1.0, -1.0) * p.z * uShadowLift;
      p = vec3(p.xy + offset, -1.0);
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export default vertexShader;

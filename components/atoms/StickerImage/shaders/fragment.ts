const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uSize;
  uniform vec3 uBackColor;
  uniform float uCorner;
  uniform float uShade;
  uniform float uOpacity;

  uniform float uIsShadow;
  uniform float uShadowOpacity;

  varying vec2 vUv;
  varying float vRoll;

  // Same rounded corners as the DOM image underneath (rounded-3xl).
  float roundedBoxAlpha(vec2 uv) {
    vec2 p = (uv - 0.5) * uSize;
    vec2 q = abs(p) - (uSize * 0.5 - uCorner);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uCorner;
    float aa = fwidth(d);
    return 1.0 - smoothstep(-aa, aa, d);
  }

  // object-fit: cover, so any image ratio fills the sticker.
  vec2 coverUv(vec2 uv) {
    float planeRatio = uSize.x / uSize.y;
    float imageRatio = uImageSize.x / uImageSize.y;
    vec2 scale = planeRatio > imageRatio
      ? vec2(1.0, imageRatio / planeRatio)
      : vec2(planeRatio / imageRatio, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float alpha = roundedBoxAlpha(vUv) * uOpacity;
    if (alpha <= 0.0) discard;

    if (uIsShadow > 0.5) {
      gl_FragColor = vec4(vec3(0.0), alpha * uShadowOpacity);
      return;
    }

    // Front: the image. Back: a flat brand colour, like the back of a sticker.
    vec3 color = gl_FrontFacing
      ? texture2D(uTexture, coverUv(vUv)).rgb
      : uBackColor;
    // Kept deliberately flat: just enough darkening to read the curl.
    color *= 1.0 - uShade * vRoll;

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export default fragmentShader;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;

  uniform float uAspect;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
   vec2 centered = vUv - 0.5;
   centered.x *= uAspect;

   // lissajous drift: two independent oscillators, one per axis, with an
   // unrelated frequency ratio (1.3:2.1) so the path takes a long time to
   // repeat and doesn't read as a simple circular orbit
   vec2 lissajous = vec2(
     sin(uTime * 1.3),
     sin(uTime * 2.1 + 1.7)
   ) * 0.05;
   centered -= lissajous;

   vec2 mouseCentered = uMouse - 0.5;
   mouseCentered.x *= uAspect;

   float angle = atan(centered.y, centered.x);
   float radius = length(centered);

   // higher, mismatched frequencies here too, for organic surface texture
   // layered on top of the center drift
    float wobble = sin(angle * 1.0 + uTime * 2.2) * 0.02
              + sin(angle * 1.0 - uTime * 1.1) * 0.01;

   float dist = radius + wobble; 

   float mouseDist = length(centered - mouseCentered);
   float mouseInfluence = smoothstep(0.4, 0.0, mouseDist);
   dist -= mouseInfluence * 0.15;

   float t = clamp(dist / 0.4, 0.0, 1.0);
   vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.961), t);
   gl_FragColor = vec4(color, 1.0);
  }
`;

export default fragmentShader;

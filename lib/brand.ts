// Mirrors the --color-*-brand tokens in app/globals.css, for places that
// need the raw value (WebGL uniforms, animated colours).
export type BrandColor = 'green' | 'yellow' | 'blue' | 'orange';

export const BRAND_HEX: Record<BrandColor, string> = {
  green: '#42c251',
  yellow: '#ecc03a',
  blue: '#2c98fe',
  orange: '#fb713f',
};

// Static class names (Tailwind can't see dynamically built ones).
export const BRAND_BG_CLASS: Record<BrandColor, string> = {
  green: 'bg-green-brand',
  yellow: 'bg-yellow-brand',
  blue: 'bg-blue-brand',
  orange: 'bg-orange-brand',
};

export interface StickerSettings {
  // Which edge lifts while scrolling down: the trailing one (bottom, as if
  // dragged through air) or the leading one (top). Scrolling up mirrors it.
  peelEdge: 'trailing' | 'leading';
  // Max share of the sticker's height that can lift at full scroll speed.
  maxPeel: number;
  // Scroll speed (px/s) that produces the full peel.
  fullPeelSpeed: number;
  // 0..1 — how fast the peel follows the scroll speed (lower = lazier).
  damping: number;
  radius: number;
  tilt: number;
  layerGap: number;
  shade: number;
  // Camera field of view (deg): lower = flatter, closer to an orthographic
  // look; higher = the lifted paper grows towards the viewer.
  perspective: number;
  corner: number;
  shadowOpacity: number;
  shadowLift: number;
  shadowOffset: number;
  revealDuration: number;
  // Lab only: freezes the peel at a fixed value to inspect it.
  manualPeel: boolean;
  manualPeelValue: number;
}

export const defaultStickerSettings: StickerSettings = {
  peelEdge: 'trailing',
  maxPeel: 0.35,
  fullPeelSpeed: 3000,
  damping: 0.1,
  radius: 45,
  tilt: 0.12,
  layerGap: 6,
  shade: 0.12,
  perspective: 14,
  corner: 24,
  shadowOpacity: 1,
  shadowLift: 0.5,
  shadowOffset: 0,
  revealDuration: 1.4,
  manualPeel: false,
  manualPeelValue: 0,
};

// Dispatched on window to replay every sticker's reveal (lab).
export const STICKER_REPLAY_EVENT = 'sticker:replay';

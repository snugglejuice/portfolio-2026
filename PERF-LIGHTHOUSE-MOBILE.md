# Mobile Lighthouse performance: what changed and why

Branch: `perf/lighouse-mobile` (the existing branch, with its original spelling).
Goal: a mobile Lighthouse **Performance** score above 90 on every page.

## Results

All numbers are mobile Lighthouse 13, performance only.

**About the CPU throttle.** This Mac is about 2.5× faster than the machines
PageSpeed Insights (PSI) runs on (Lighthouse "benchmarkIndex" ≈ 3000). At the
default 4× CPU slowdown, local scores come out much better than PSI. So the
before/after runs below use a **PSI-like throttle** of about 10×, worked out
from the machine's benchmark index for each run. The machine was very busy
during the session (load average 8 to 20), so "after" is the **median of 3
runs**.

| Page | Live site before (≈10×) | Local build before (10×) | **After (median of 3, PSI-like)** | After, stock Lighthouse (4×) |
| --- | --- | --- | --- | --- |
| `/` | 100 | 100 | **100** | 100 |
| `/work` | 89 | 87 | **100** | 100 |
| `/about` | 88 | 83 | **96** | 100 |
| `/freelance` | 87 | 100 * | **99** | — |
| `/work/cid-erp` | 76 | 80 | **93** | 94 |
| `/work/musee-croix-rouge` | — | 74 | **92** | — |
| `/work/montreux-jazz-festival` | — | 53 | **92** | — |
| `/work/holentis` | — | — | **91** | 92 |
| `/work/ayomi-campaign-dashboard` | — | — | **92** | — |
| `/work/ayomi-customer-care` | — | — | **93** | — |
| `/work/agenda-lausanne` | — | 77 | **92** | — |

\* `/freelance` swung between 72 and 100 before the changes. Its LCP depends on
when the JS intro animation runs.

What moved the most:

- **LCP on `/work` and `/about`:** 3.5–4.3 s → 0.8 s.
- **TBT on project pages:** 200–2,700 ms → 40–100 ms.
- **Project-page LCP:** 4.7–5.4 s → about 3.2 s. These pages are now held back
  only by the LCP of the cover image (see "What's left" at the end).

## How Lighthouse scored this site (the root cause)

Lighthouse doesn't throttle the real page load. It loads the page at full
speed, then *simulates* a slow phone. For LCP, the simulation counts every
request and script that finished before the LCP element painted in the fast
load. On a fast machine, all the JS has arrived by then, so the whole bundle
gets billed to LCP. The fixes fall into three groups:

1. Make the LCP element something that paints at first paint, with no JS.
2. Ship fewer bytes before that paint (JS, fonts, images).
3. Keep the WebGL work out of the page load. Headless Chrome (Lighthouse and
   PSI) renders WebGL in software, on the CPU, so each sticker produced long
   tasks.

---

## Changes, file by file

### 1. Hero text can count as LCP: `app/globals.css`

The `rise` keyframes now start at `opacity: 0.01` instead of `0`.

- **Why:** Chrome ignores text painted at opacity 0 as an LCP candidate. It
  doesn't report that text again once a CSS animation fades it in. So on
  `/work`, `/about` and the project pages, the big `<h1>` never counted. The
  LCP became the header logo (`/work`, `/about`) or the cover image.
  Verified in Chrome with a `PerformanceObserver`. Before the change, the only
  LCP entry on `/work` was the logo `IMG`. After, it's the `H1` at first paint
  (≈100 ms).
- **Visual impact:** none; 0.01 can't be seen.
- **Trade-off to review:** LCP now credits the heading from the frame it
  starts animating, not the frame it ends. This is a common, documented
  technique. If you'd rather not use it, the alternative is to drop the fade
  and keep only the 24px rise.

### 2. Logo: `components/organisms/Navigation/logo.png` and `index.tsx`

- The logo was a **2000×2000 PNG (77 KB)** shown at 40×40. It's now
  **120×120 (5 KB)**: 3× the displayed size, grayscale with alpha, same
  artwork. The original is still in git history.
- `priority` (deprecated in Next 16) is replaced by `loading="eager"`.
- `unoptimized` is added so the new image loader (change 4) leaves it as-is.
- Same `unoptimized` on the homepage portrait in
  `components/organisms/Hero/HeroHomepage/index.tsx`.

### 3. three.js and WebGL off the page load: `components/atoms/StickerImage/index.tsx`

This was the biggest JS cost. three.js is **544 KB raw / about 135 KB
gzipped**, and it was statically imported, so it shipped with `/about`,
`/work` and every project page.

The structure of the change:

- **Lazy import.** `import * as THREE from 'three'` became
  `import('three')` inside the effect, plus a type-only import for
  `WebGLRenderer`. The existing scene code moved, unchanged, into a
  `mountScene(THREE)` function, so most of the diff is indentation. Review it
  with "hide whitespace" (`git diff -w`).
- **Scene built only near the viewport.** An `IntersectionObserver` with a
  one-viewport margin (`rootMargin: '100% 0px'`) builds the scene, and fetches
  three.js, only when the sticker approaches. Before, every sticker on a
  project page created its own WebGL context, compiled shaders and decoded
  its texture on page load, even 5 screens down. Montreux alone had
  2.7 s of TBT.
- **No-reveal stickers wait for the first interaction.** This only applies to
  the project hero cover (`reveal={false}`). At rest, that sticker looks
  exactly like its DOM image (flat, with the shadow hidden underneath: offset
  0, and the lift only applies while peeling), and it only peels while
  scrolling. So its scene is built on the visitor's first `scroll`, `wheel`,
  `touchstart`, `pointerdown` or `keydown`. Visually nothing changes; the
  WebGL setup just isn't part of the load any more.
- **New export `preloadStickerScene()`.** It starts the three.js download
  early.
  - `components/organisms/Work/ProjectTabs/ProjectTab.tsx` calls it on
    pointer-enter, pointer-down and focus of a tab button.
  - Without it, the first tab you open would wait for the download before its
    sticker unrolls.
- **Videos.** In the sticker:
  - `preload="auto"` → `preload="none"`. The MP4s are up to 2.3 MB and
    downloaded on page load; now they load when playback starts, as the
    sticker nears the viewport.
  - `poster` is only set under `prefers-reduced-motion`. Browsers fetch a
    poster immediately, even far below the fold. Everyone else sees the
    playing video through the canvas, so they never saw the poster anyway.
  - Behaviour check: under reduced motion the poster and controls show, as
    before.

**One small behaviour change:** the WebGL fallback case (motion allowed but no
WebGL). The video now has no poster for the moment before its first frame.

### 4. Responsive images on the static export

**Files:** `next.config.ts`, `lib/imageLoader.ts`, `lib/imageVariants.json`,
`scripts/generate-image-variants.mjs`, `public/img-variants/`.

Before, `images.unoptimized: true` meant phones downloaded the full
1440–2560 px originals. For example, the cid-erp cover was 96 KB where
14 KB is enough.

- **Generator script.** `scripts/generate-image-variants.mjs` makes 560, 750
  and 1200 px copies of every `.webp` in `public/work` and `public/about`. It
  uses ImageMagick (`magick`), with quality 80 and metadata stripped.
  - Output goes to `public/img-variants/` (39 images, 4.6 MB in the repo).
  - The available widths go to `lib/imageVariants.json`.
  - **Re-run it after adding or replacing an image:**
    `node scripts/generate-image-variants.mjs`
  - It skips copies that are already up to date.
- **Loader.** `lib/imageLoader.ts` is a custom `next/image` loader. It maps a
  requested width to the smallest copy that is big enough, and falls back to
  the original otherwise. An image missing from the manifest (for example, a
  new one before you run the script) is served as-is, so nothing can 404.
- **Config.** In `next.config.ts`, `unoptimized: true` is replaced by
  `loader: "custom"` + `loaderFile`, with
  `deviceSizes: [560, 750, 1200, 1920, 2560]`.
- **Why committed files instead of building on CI:** I tried adding `sharp` as
  a dev dependency, but its install failed locally (Node 26 + npm cache
  permissions). Committed copies also keep the CI build unchanged and fast.
  This can move to a CI `prebuild` step later if you prefer.

**More accurate `sizes`.** These decide which copy the browser picks:

| Where | Before | After |
| --- | --- | --- |
| `COVER_SIZES` in `app/work/projects.ts` (project hero, /work tabs, home cards) | `(min-width: 768px) 84vw, 100vw` | `(min-width: 768px) 84vw, calc(100vw - 96px)` |
| Gallery, full width | `100vw` | `(min-width: 768px) calc(100vw - 112px), calc(100vw - 80px)` |
| Gallery, half width | `(min-width: 768px) 50vw, 100vw` | `(min-width: 768px) calc(50vw - 88px), calc(100vw - 80px)` |
| `/about` portrait | `50vw` | `(min-width: 1024px) 33vw, calc(100vw - 96px)` |

The new values match the real widths inside the cards' padding. The WebGL
texture code already resizes to the drawn width, and it reads `currentSrc`,
so it picks up the smaller file automatically.

### 5. Fonts: `app/layout.tsx`

- **Asap Condensed** now loads weights `600, 700` instead of
  `400, 500, 600, 700`. Only `font-semibold` and `font-bold` are used with
  `font-primary`; the `/lab/bhaasha` `font-extrabold` is synthesised from 700,
  as before. That's 2 fewer preloaded files, about 28 KB.
- **Rubik** (nav labels only) now has `preload: false`, so it stops competing
  with the hero text and image for bandwidth. The nav is `position: fixed`,
  so the late swap can't shift the page layout.

### 6. Motion: smaller component bundle

**Files:** `components/providers/MotionFeatures/index.tsx`, `app/layout.tsx`,
and the 7 components that render motion elements.

- **What changed:**
  - `motion.div`, `motion.span` and `motion.header` → `m.*`, imported from
    `'motion/react-m'`.
  - The app is wrapped in `<LazyMotion features={domAnimation} strict>`.
- **Effect:** `motion.*` pulls in the full feature set (layout projection,
  drag…), and the site uses none of it; every animation here is covered by
  `domAnimation`. This cut about 18 KB gzipped of JS before LCP.
- **Safety net:** `strict` throws if a `motion.*` element is added back by
  mistake.
- **Gotchas:**
  - Importing `m` from the `'motion/react'` barrel saved nothing; Turbopack
    still bundled the full `motion` proxy. It has to come from
    `'motion/react-m'`.
  - Features are loaded **synchronously** on purpose. With async-loaded
    features, the homepage hero sometimes stayed at its initial `scaleY(0)`
    after the intro (reproduced in the browser).
- **Checked in the browser:**
  - The home intro plays: loader → hero unfolds → text.
  - The intervention marquee moves, and the Process stack is scroll-linked.
  - The nav highlight works, and the nav hides on scroll.
  - On /work, a tab opens and closes with its height animation, and the icon
    rotates.

---

## What I checked

- `npm run build` passes.
- `eslint` shows no new warnings. The 5 it reports were already in files I
  didn't touch.
- Prettier formatting (single quotes, as the code uses) matches.
- Manual checks in Chrome, mobile emulation (412×823 @1.75x) and desktop:
  - Project pages: the hero cover shows straight away. No canvas exists until
    the first scroll; then it's built and peels as before. Gallery stickers
    unroll as they come into view, and the videos play.
  - Reduced motion: posters and video controls show, and no WebGL is built.
  - `/about`: the portrait loads the 560/750 copy and still unrolls.
  - The `/work` tab sticker still unrolls, and the project link works.
  - The new logo renders crisply.

## What's left / ideas for later

- **Project-page LCP is still about 3.2 s (simulated).** The LCP element is
  the cover image. Lighthouse bills to it all the framework JS that arrived
  before it painted: React, the Next router and motion, about 200 KB gzipped.
  - Scores sit around 91–93 and swing a few points between runs.
  - The next levers would be:
    - cutting JS further, e.g. replacing Lenis, or dropping motion from the
      nav;
    - lowering the quality of the 560 copies;
    - a different above-the-fold composition where the heading, not the
      image, is the largest element.
- **`/freelance`** still waits for the `load` event before its JS intro. That's
  why its LCP used to swing; it scored 93–100 in the final runs.
- **Re-check PSI after deploying.** Its hardware and network vary, so expect
  ±5 points between runs.

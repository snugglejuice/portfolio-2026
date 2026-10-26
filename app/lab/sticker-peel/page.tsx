'use client';

import { useEffect, useState } from 'react';
import GUI from 'lil-gui';

import StickerImage from '@/components/atoms/StickerImage';
import {
  defaultStickerSettings,
  STICKER_REPLAY_EVENT,
} from '@/components/atoms/StickerImage/settings';

const BRAND = {
  green: '#42c251',
  yellow: '#ecc03a',
  blue: '#2c98fe',
  orange: '#fb713f',
};

const IMAGES = {
  wide: {
    src: '/work/croix-rouge/showcase-01.webp',
    width: 2560,
    height: 1986,
  },
  square: {
    src: '/work/croix-rouge/showcase-02.webp',
    width: 2560,
    height: 2560,
  },
  wideAlt: {
    src: '/work/croix-rouge/showcase-03.webp',
    width: 2560,
    height: 1986,
  },
};

const TAGS = ['Lead dev', 'UX / UI', 'Museum'];

export default function WorkLab() {
  // One mutable object shared by every sticker: the GUI edits it in place
  // and each sticker reads it on every frame.
  const [settings] = useState(() => ({ ...defaultStickerSettings }));

  useEffect(() => {
    const gui = new GUI({ width: 340, title: 'Sticker peel' });

    const peel = gui.addFolder('Scroll peel');
    peel
      .add(settings, 'peelEdge', {
        'Trailing edge': 'trailing',
        'Leading edge': 'leading',
      })
      .name('Peeling edge');
    peel.add(settings, 'maxPeel', 0, 0.8, 0.01).name('Max peel');
    peel
      .add(settings, 'fullPeelSpeed', 500, 8000, 100)
      .name('Speed for max (px/s)');
    peel.add(settings, 'damping', 0.01, 1, 0.01).name('Responsiveness');
    peel.add(settings, 'radius', 10, 300, 1).name('Curl radius');
    peel.add(settings, 'tilt', -0.5, 0.5, 0.01).name('Tilt');
    peel.add(settings, 'layerGap', 0, 20, 0.5).name('Curl thickness');
    peel.add(settings, 'manualPeel').name('Freeze (manual)');
    peel.add(settings, 'manualPeelValue', -1, 1, 0.01).name('Frozen value');

    const look = gui.addFolder('Look');
    look.add(settings, 'shade', 0, 0.6, 0.01).name('Fold shading');
    look.add(settings, 'perspective', 2, 60, 1).name('Perspective (fov)');
    look.add(settings, 'corner', 0, 80, 1).name('Corner radius (px)');
    look.add(settings, 'shadowOpacity', 0, 1, 0.01).name('Shadow opacity');
    look.add(settings, 'shadowLift', 0, 1.5, 0.01).name('Shadow / lift');
    look.add(settings, 'shadowOffset', 0, 24, 1).name('Base shadow (px)');

    const reveal = gui.addFolder('Reveal');
    reveal.add(settings, 'revealDuration', 0.3, 4, 0.1).name('Duration (s)');
    reveal
      .add(
        {
          replay: () => window.dispatchEvent(new Event(STICKER_REPLAY_EVENT)),
        },
        'replay',
      )
      .name('▶ Replay');

    return () => gui.destroy();
  }, [settings]);

  return (
    <main className="p-4 flex flex-col gap-4">
      <header className="bg-foreground rounded-3xl p-10 flex flex-col gap-4">
        <p className="font-secondary text-lg text-[#808080]">
          /lab/sticker-peel — prototype
        </p>
        <h1 className="font-primary uppercase font-bold text-[104px] leading-none">
          Sticker peel
        </h1>
        <p className="font-secondary text-2xl max-w-3xl">
          Scroll fast, then slowly, in both directions: the visuals peel off
          like stickers and reveal the project colour on their back. The
          controls are in the panel at the top right.
        </p>
      </header>

      {/* Mirrors the opened accordion row planned for /work. */}
      <section className="bg-orange-brand rounded-3xl p-10 grid grid-cols-12 gap-5 items-start">
        <div className="col-span-12 flex justify-between items-center pb-6">
          <h2 className="font-primary uppercase font-bold text-[64px] leading-none">
            Red Cross Museum
          </h2>
          <ul className="flex gap-2">
            {TAGS.map((tag) => (
              <li
                key={tag}
                className="bg-white border-2 border-black rounded-full py-1 px-4 font-secondary font-medium"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <StickerImage
          {...IMAGES.wide}
          alt="Homepage of the International Red Cross and Red Crescent Museum website"
          backColor={BRAND.yellow}
          sizes="60vw"
          eager
          settings={settings}
          className="col-span-7"
        />
        <div className="col-start-9 col-end-13 flex flex-col gap-4 font-secondary text-2xl">
          <p className="font-bold">
            A website designed to extend the Museum’s commitment and amplify
            its reach to a worldwide audience.
          </p>
          <p>
            Placeholder text, the real copy comes with the work page.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-foreground rounded-3xl p-10">
          <StickerImage
            {...IMAGES.square}
            alt="Interface detail from the Museum website"
            backColor={BRAND.blue}
            sizes="50vw"
            settings={settings}
          />
        </div>
        <div className="bg-foreground rounded-3xl p-10 flex flex-col justify-end gap-4">
          <h3 className="font-primary uppercase font-bold text-[48px] leading-none">
            Coloured back
          </h3>
          <p className="font-secondary text-2xl">
            Each project gets its own brand colour: that is what shows when
            the visual flips over.
          </p>
        </div>
      </section>

      <section className="bg-foreground rounded-3xl p-10">
        <StickerImage
          {...IMAGES.wideAlt}
          alt="Exhibition page on the Museum website"
          backColor={BRAND.green}
          sizes="100vw"
          settings={settings}
        />
      </section>

      <section className="grid grid-cols-3 gap-4">
        {[BRAND.yellow, BRAND.blue, BRAND.orange].map((color, index) => (
          <div key={color} className="bg-foreground rounded-3xl p-6">
            <StickerImage
              {...(index === 1 ? IMAGES.square : IMAGES.wide)}
              alt=""
              backColor={color}
              sizes="33vw"
              settings={settings}
            />
          </div>
        ))}
      </section>

      <div className="h-[60vh]" />
    </main>
  );
}

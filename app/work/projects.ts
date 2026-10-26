// First draft of the /work content, written from public sources (live
// sites, Superhuit case study). Every line marked TODO(Marion) is a guess or
// a gap that needs your eye before going live.

import type { BrandColor } from '@/lib/brand';

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  // Videos only: still frame shown before playback and as sticker texture.
  poster?: string;
  width: number;
  height: number;
  alt: string;
  // Gallery layout: full width, or half of a two-column row.
  layout: 'full' | 'half';
}

export interface Project {
  slug: string;
  name: string;
  // Shorter label for the /work tabs, when the name doesn't fit on a line.
  shortName?: string;
  client: string;
  role: string;
  year?: string;
  color: BrandColor;
  // Back of the sticker: always a different colour than the card it sits on,
  // otherwise the peel reads as a hole rather than paper.
  stickerBack: BrandColor;
  tags: [string, string, string];
  // Accordion: bold first line + short paragraphs.
  pitch: string;
  summary: string[];
  challenge: string[];
  answer: string[];
  focus?: { title: string; body: string[] };
  quote?: { text: string; author: string; role: string };
  stack: string[];
  liveUrl: string;
  superhuitUrl: string;
  cover: ProjectMedia;
  gallery: ProjectMedia[];
}

export const WORK_INTRO =
  'As lead dev at Superhuit, I drove the development of platforms for a software company, a museum, a festival, a healthcare network and a city. Five projects, one obsession: making complex things easy to navigate.';

const SUPERHUIT_URL = 'https://superhuit.ch/fr/';

// Shared by the /work accordion and the project hero so both request the
// same image file (see ProjectTab).
export const COVER_SIZES = '(min-width: 768px) 84vw, 100vw';

export const PROJECTS: Project[] = [
  {
    slug: 'cid-erp',
    name: 'CID ERP',
    client: 'Fair IT',
    role: 'Lead dev',
    // TODO(Marion): année de mise en ligne.
    color: 'yellow',
    stickerBack: 'blue',
    tags: ['Lead dev', 'Product site', 'Concrete CMS'],
    pitch:
      'Making sense of business software that covers an entire company.',
    summary: [
      'CID ERP is modular Swiss business software: accounting, payroll, inventory, CRM… The site has to present dozens of modules without losing visitors who first want an answer for their own line of work.',
      'Navigation is organised by profile (SMEs, institutions, industries), then by module, and every page shows the software in action instead of describing it.',
    ],
    challenge: [
      'A rich, technical product aimed at very different audiences: management, accounting, human resources. Each of them has to quickly find the part of the software that matters to them, and want to book a demo.',
    ],
    answer: [
      'An architecture built around solutions and modules, pages assembled from reusable blocks, and animated demos of the software embedded right in the content.',
      // TODO(Marion): ce que tu as fait concrètement en tant que lead dev (blocs Concrete, perfs, intégration des démos, etc.).
      'I led the development of the site, from setting up the templates to launch.',
    ],
    // TODO(Marion): stack détectée sur le site live, à confirmer / compléter.
    stack: ['Concrete CMS'],
    liveUrl: 'https://www.cid-erp.ch/',
    superhuitUrl: SUPERHUIT_URL,
    cover: {
      type: 'image',
      src: '/work/cid-erp/overview.webp',
      width: 2560,
      height: 1476,
      alt: 'CID ERP software interface: general ledger view',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/cid-erp/home.webp',
        width: 2400,
        height: 1500,
        alt: 'CID ERP website homepage',
        layout: 'full',
      },
      {
        type: 'video',
        src: '/work/cid-erp/releve.mp4',
        poster: '/work/cid-erp/releve-poster.webp',
        width: 1450,
        height: 836,
        alt: 'Animated demo: importing a bank statement into CID ERP',
        layout: 'half',
      },
      {
        type: 'video',
        src: '/work/cid-erp/immo.mp4',
        poster: '/work/cid-erp/immo-poster.webp',
        width: 1450,
        height: 836,
        alt: 'Animated demo: managing fixed assets in CID ERP',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/cid-erp/mobile.webp',
        width: 900,
        height: 1948,
        alt: 'The CID ERP website on mobile',
        layout: 'half',
      },
    ],
  },
  {
    slug: 'musee-croix-rouge',
    name: 'International Red Cross Museum',
    shortName: 'Red Cross Museum',
    client: 'International Red Cross and Red Crescent Museum',
    role: 'Lead dev',
    year: '2025',
    color: 'orange',
    stickerBack: 'yellow',
    tags: ['Lead dev', 'Next.js', 'WordPress headless'],
    pitch:
      'A website designed to extend the Museum’s commitment and amplify its reach to a worldwide audience.',
    summary: [
      'The Museum wanted to showcase the richness of what it offers (exhibitions, events, meeting spaces) and embody its refreshed visual identity, designed to be accessible, inclusive and legible.',
      'The site becomes a clear, flexible platform in three languages for an international audience.',
    ],
    challenge: [
      'Raise the Museum’s profile and strengthen its image internationally. The site had to put exhibitions and events forward while staying accessible to every audience.',
    ],
    answer: [
      'A UX that simplifies the user journeys, a UI that carries the Museum’s identity into a legible digital world, and a reliable, scalable technical foundation optimised for performance.',
      // TODO(Marion): ton apport précis (architecture headless, accessibilité, perfs, multilingue…).
      'I led the development of the platform, from the Next.js front end to wiring up the WordPress content.',
    ],
    focus: {
      title: 'Accessible by default',
      body: [
        // TODO(Marion): à étayer avec ce que tu as réellement mis en place (niveau visé, audits, tests lecteurs d’écran…).
        'The Museum’s identity was designed to be legible for everyone. The site carries that promise all the way into the code: semantic structure, keyboard navigation, contrast and content in three languages.',
      ],
    },
    quote: {
      text: 'The redesign of our website was a pleasant, efficient and creative experience that even went beyond our expectations.',
      author: 'Justine Langlois',
      role: 'Head of Communication at the Museum',
    },
    // TODO(Marion): stack détectée sur le site live (Next.js + WordPress), à confirmer.
    stack: ['Next.js', 'WordPress headless'],
    liveUrl: 'https://redcrossmuseum.ch/fr/',
    superhuitUrl:
      'https://superhuit.ch/fr/projets/musee-international-de-la-croix-rouge-et-du-croissant-rouge/',
    cover: {
      type: 'image',
      src: '/work/croix-rouge/showcase-01.webp',
      width: 2560,
      height: 1986,
      alt: 'Page for the permanent exhibition “The Humanitarian Adventure” on the Museum website',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/croix-rouge/home.webp',
        width: 2400,
        height: 1500,
        alt: 'Museum homepage: “How does humanitarian action concern us all, here and now?”',
        layout: 'full',
      },
      {
        type: 'image',
        src: '/work/croix-rouge/showcase-02.webp',
        width: 2560,
        height: 2560,
        alt: 'Three mobile screens of the site: exhibition, prices and menu',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/croix-rouge/showcase-03.webp',
        width: 2560,
        height: 1986,
        alt: 'An exhibition page on the Museum website',
        layout: 'half',
      },
    ],
  },
  {
    slug: 'montreux-jazz-festival',
    name: 'Montreux Jazz Festival',
    client: 'Montreux Jazz Festival',
    role: 'Lead frontend',
    // TODO(Marion): édition / année de la refonte du programme.
    color: 'blue',
    stickerBack: 'yellow',
    tags: ['Lead frontend', 'Programme', 'WordPress'],
    pitch:
      'Redesigning the festival programme: the heart of the site, which has to excite as much as it informs.',
    summary: [
      'Sixteen nights, several stages, dozens of artists. The programme has to let you spot a concert at a glance, listen to it, then buy a ticket without leaving the page.',
      'Each night reads as a grid, stage by stage, with genres, prices, ticket availability and a clip to listen to.',
    ],
    challenge: [
      'Fitting a dense line-up into an interface that reads well on every screen, without sacrificing the visual energy of a world-renowned festival.',
    ],
    answer: [
      'A grid by day and by stage on desktop that folds into a chronological list on mobile, colourful artist cards and direct actions: listen, add to favourites, buy.',
      // TODO(Marion): ton périmètre exact en tant que lead frontend (composants, état des billets, audio, transitions Swup…).
      'As lead frontend, I led the development of this new programme interface.',
    ],
    focus: {
      title: 'A grid you can read at a glance',
      body: [
        'Dates in columns, stages in rows: the Auditorium Stravinski and the Montreux Jazz Lab read side by side. Each card carries the essentials (time, artist, genres, price) and ticket status: available, sold out or waiting list.',
        // TODO(Marion): détails techniques intéressants (lecteur audio, filtres par date, performance avec beaucoup d’images…).
      ],
    },
    // TODO(Marion): stack détectée sur le site live (WordPress + Swup), à confirmer.
    stack: ['WordPress', 'Swup'],
    liveUrl: 'https://www.montreuxjazzfestival.com/fr/programme/',
    superhuitUrl: SUPERHUIT_URL,
    cover: {
      type: 'image',
      src: '/work/montreux-jazz/programme-02.webp',
      width: 2400,
      height: 1500,
      alt: 'Montreux Jazz Festival programme: concert grid by day and by stage',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/montreux-jazz/programme-01.webp',
        width: 2400,
        height: 1500,
        alt: 'Header of the Montreux Jazz Festival programme page',
        layout: 'full',
      },
      {
        type: 'image',
        src: '/work/montreux-jazz/mobile.webp',
        width: 900,
        height: 1948,
        alt: 'The programme on mobile, as a chronological list',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/montreux-jazz/programme-03.webp',
        width: 2400,
        height: 1500,
        alt: 'Artist cards with clips to listen to and ticket availability',
        layout: 'half',
      },
    ],
  },
  {
    slug: 'holentis',
    name: 'Holentis',
    client: 'Holentis (formerly Rachis Clinic)',
    role: 'Lead dev',
    // TODO(Marion): année de mise en ligne.
    color: 'green',
    stickerBack: 'yellow',
    tags: ['Lead dev', 'Rebranding', 'WordPress'],
    pitch:
      'Taking a name change online: Rachis Clinic becomes Holentis.',
    summary: [
      'Holentis brings together doctors, therapists and musculoskeletal rehabilitation specialists in a flagship centre in Lausanne-Vennes and twelve consultation centres across French-speaking Switzerland.',
      'The site has to establish a new name without losing the trust of patients, referring doctors and partner companies.',
    ],
    challenge: [
      'Three audiences with very different expectations (patients, doctors, companies) and a new name to bring to life, on a health topic where clarity and trust come first.',
    ],
    answer: [
      'Dedicated spaces for doctors and patients, a rehabilitation journey explained step by step, sourced figures to frame the issue, and an interactive map of the consultation centres.',
      // TODO(Marion): ton apport précis (thème WordPress, blocs, carte, accessibilité, perfs…).
      'I led the development of the site, from implementing the new identity to launch.',
    ],
    // TODO(Marion): stack détectée sur le site live (WordPress), à confirmer / compléter.
    stack: ['WordPress'],
    liveUrl: 'https://holentis.ch/',
    superhuitUrl: SUPERHUIT_URL,
    cover: {
      type: 'image',
      src: '/work/holentis/home.webp',
      width: 2400,
      height: 1500,
      alt: 'Holentis homepage: “Let’s shape the path to your independence together”',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/holentis/statistiques.webp',
        width: 2400,
        height: 1500,
        alt: 'Statistics section: a major health issue, backed by sourced figures',
        layout: 'full',
      },
      {
        type: 'image',
        src: '/work/holentis/parcours.webp',
        width: 2400,
        height: 1500,
        alt: 'The rehabilitation journey explained step by step',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/holentis/mobile.webp',
        width: 900,
        height: 1948,
        alt: 'The Holentis website on mobile',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/holentis/centres.webp',
        width: 2400,
        height: 1500,
        alt: 'Map of the consultation centres in French-speaking Switzerland',
        layout: 'full',
      },
    ],
  },
  {
    slug: 'agenda-lausanne',
    name: 'Lausanne Events Calendar',
    client: 'City of Lausanne',
    role: 'Lead dev',
    // TODO(Marion): année de mise en ligne.
    color: 'orange',
    stickerBack: 'green',
    tags: ['Lead dev', 'Vue.js', 'Public service'],
    pitch:
      'Hundreds of events to explore by theme, by date or by venue.',
    summary: [
      'The City of Lausanne’s events calendar brings together exhibitions, concerts, kids’ activities and neighbourhood events for every audience.',
      'Three entry points lead to the same content: suggestions by theme, a filterable calendar and a map of venues.',
    ],
    challenge: [
      'A public service used by the whole population: it has to be fast, accessible, and let you find an outing in seconds among hundreds of events.',
    ],
    answer: [
      'A calendar with simple filters (indoors, evening, free…), a map that groups events by venue, and editorial picks for inspiration.',
      // TODO(Marion): ton apport précis (app Vue intégrée au site de la Ville, API, filtres, carte, perfs…).
      'I led the development of the calendar, from filtered search to the venue map.',
    ],
    focus: {
      title: 'Three entry points, one set of content',
      body: [
        'By theme for inspiration, by date to plan ahead, by venue to go out nearby: all three views share the same data and the same filters.',
        // TODO(Marion): détails techniques (gestion de l’état des filtres, URL partageables, clustering de la carte…).
      ],
    },
    // TODO(Marion): stack détectée sur le site live (Vue + Vite, dans le CMS Magnolia de la Ville), à confirmer.
    stack: ['Vue.js', 'Vite'],
    liveUrl: 'https://www.lausanne.ch/agenda-et-actualites/agenda.html',
    superhuitUrl: SUPERHUIT_URL,
    cover: {
      type: 'image',
      src: '/work/agenda-lausanne/par-date.webp',
      width: 2400,
      height: 1500,
      alt: 'Lausanne events calendar: list of events by date with filters',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/agenda-lausanne/suggestions.webp',
        width: 2400,
        height: 1500,
        alt: 'Suggestions by theme on the Lausanne events calendar',
        layout: 'full',
      },
      {
        type: 'image',
        src: '/work/agenda-lausanne/mobile.webp',
        width: 900,
        height: 1948,
        alt: 'The Lausanne events calendar on mobile',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/agenda-lausanne/par-lieu.webp',
        width: 2400,
        height: 1500,
        alt: 'Venue map of the Lausanne events calendar, with events grouped by venue',
        layout: 'half',
      },
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

// Loops back to the first project after the last one.
export function getNextProject(slug: string) {
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  return PROJECTS[(index + 1) % PROJECTS.length];
}

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
  liveUrl?: string;
  superhuitUrl?: string;
  cover: ProjectMedia;
  gallery: ProjectMedia[];
}

export const WORK_INTRO =
  'As lead dev at Superhuit, I drove the front-end of an ERP product, and of websites for a museum, a festival, a healthcare network and a city. Before that, I designed and built fundraising tools at Ayomi, a Paris fintech. Seven projects, one obsession: making complex things easy to navigate.';

const SUPERHUIT_URL = 'https://superhuit.ch/fr/';

// Shared by the /work accordion and the project hero so both request the
// same image file (see ProjectTab).
export const COVER_SIZES = '(min-width: 768px) 84vw, 100vw';

// Shown on the homepage, in /work order (and with their /work numbers, so a
// card never morphs into a hero showing another number).
export const FEATURED_SLUGS = [
  'cid-erp',
  'musee-croix-rouge',
  'montreux-jazz-festival',
];

export const PROJECTS: Project[] = [
  {
    slug: 'cid-erp',
    name: 'CID ERP',
    client: 'Fair IT',
    role: 'Lead front-end developer',
    year: '2024 - Today',
    color: 'yellow',
    stickerBack: 'blue',
    tags: ['Lead dev', 'Product development', 'Design system'],
    pitch:
      'Giving a long-running Swiss ERP a modern interface, without rewriting its engine.',
    summary: [
      'CID ERP is modular Swiss business software covering accounting, payroll, inventory, CRM and more. Its interface had aged badly, and Fair IT asked Superhuit to redesign the whole product experience.',
      'I designed the front-end architecture and wrote most of its code, with up to five developers on the team at the peak. I built the design system with our designers, then brought it and the new user flows into the live product while keeping the existing backend intact.',
      'Since summer 2024, I have been the lead developer and owner of the front-end codebase. Today I support the Fair IT team as the platform evolves, and train them to ship new features on their own.',
    ],
    challenge: [
      'A legacy backend we could not rewrite: more than 200 OpenERP modules and nearly 4,000 view definitions, all described in XML on the server.',
      'Every customer customises their screens, so we could not hand-code a fixed set of pages.',
      'Very different users, from accountants entering data all day to managers and HR, working in dense forms and long tables.',
    ],
    answer: [
      'A new React and TypeScript front-end on top of the existing backend: the business logic stays where it is, and the interface is rebuilt from scratch.',
      'An XML rendering engine. The front-end reads the XML of each screen, validates it against a schema, simplifies it, then turns it into React components. Every existing view and every customer customisation works without writing a screen by hand.',
      'The ERP’s dynamic rules rebuilt on the front-end: fields that update each other, or appear and become read-only depending on other values, so forms behave the way users expect.',
      'A design system of 60+ components in Storybook, built with our designers, and keyboard-friendly tables built for heavy data entry.',
    ],
    stack: [
      'React',
      'TypeScript',
      'TanStack Query',
      'Storybook',
      'XML / XSD',
      'Python (OpenERP)',
    ],
    liveUrl: 'https://www.cid-erp.ch/',
    superhuitUrl: SUPERHUIT_URL,
    cover: {
      type: 'image',
      src: '/work/cid-erp/overview-3.webp',
      width: 2560,
      height: 1476,
      alt: 'CID ERP software interface: general ledger view',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/cid-erp/home-2.webp',
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
      'I led the front-end development of the Montreux Jazz Festival redesign, keeping the structure but with a new style, a completely new programme and new videos / interactive sections.',
    ],
    focus: {
      title: 'A grid you can read at a glance',
      body: [
        'Dates in columns, stages in rows. Each card carries the essentials (time, artist, genres, price) and ticket status: available, sold out or waiting list, and lets you listen to the artist.',
      ],
    },
    stack: ['WordPress'],
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
        type: 'video',
        src: '/work/montreux-jazz/MJF.mp4',
        width: 1440,
        height: 1080,
        alt: 'Header of the Montreux Jazz Festival programme page',
        layout: 'full',
      },
      {
        type: 'image',
        src: '/work/montreux-jazz/MJF-2.webp',
        width: 900,
        height: 900,
        alt: 'The programme on mobile, as a chronological list',
        layout: 'half',
      },
      {
        type: 'image',
        src: '/work/montreux-jazz/MJF-3.webp',
        width: 1500,
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
    year: '2026',
    color: 'green',
    stickerBack: 'yellow',
    tags: ['Lead dev', 'Rebranding', 'WordPress'],
    pitch: 'Taking a name change online: Rachis Clinic becomes Holentis.',
    summary: [
      'Holentis brings together doctors, therapists and musculoskeletal rehabilitation specialists in a flagship centre in Lausanne-Vennes and twelve consultation centres across French-speaking Switzerland.',
      'The site has to establish a new name without losing the trust of patients, referring doctors and partner companies.',
    ],
    challenge: [
      'Three audiences with very different expectations (patients, doctors, companies) and a new name to bring to life, on a health topic where clarity and trust come first.',
    ],
    answer: [
      'Dedicated spaces for doctors and patients, a rehabilitation journey explained step by step, sourced figures to frame the issue, and an interactive map of the consultation centres.',
      'As the only developer on the project, I took it from the new identity to launch.',
    ],
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
    slug: 'ayomi-campaign-dashboard',
    name: 'Ayomi Campaign Dashboard',
    shortName: 'Ayomi Dashboard',
    client: 'Ayomi',
    role: 'UI/UX designer & front-end developer',
    year: '2021 - 2023',
    color: 'blue',
    stickerBack: 'yellow',
    tags: ['Fintech', 'Product design', 'React'],
    pitch:
      'One place for entrepreneurs to prepare, run and track their fundraising.',
    summary: [
      'Ayomi is a Paris fintech that helps entrepreneurs raise capital, with tools that automate the preparation, tracking and legal formalities of a fundraising round.',
      'Each step of a round had its own tool. Entrepreneurs got lost between them, and investor relations managers had to send recap emails full of links before every meeting.',
      'I designed the new dashboard and built its front-end, working with a team of five backend developers.',
    ],
    challenge: [
      'Bring a five-phase journey into a single, simple platform: financing file, network preparation, project page, email campaign and launch.',
      'Importing contacts from Gmail, Outlook, LinkedIn or CSV files relied on a complex API with many edge cases, and on long-running tasks the user had to be kept informed about.',
      'Four backend developers took turns on the import feature, so the front-end had to stay stable while the API kept evolving.',
    ],
    answer: [
      'A dashboard that shows every phase, its progress and the next action to take, with the amount raised, investments in progress and campaign statistics on the same page.',
      'Business logic decoupled from the interface with Redux, and real-time progress on each import with Socket.io: imported, in progress, or failed with a clear reason and a retry button.',
      'API routes defined with the backend before building, code reviews on both sides and shared documentation, so each developer could pick up where the last one left off.',
    ],
    focus: {
      title: 'The impact',
      body: [
        '+41% contacts imported per project on average after the new contact import.',
        'Meetings with investor relations managers twice as short, with every task gathered on one page.',
      ],
    },
    stack: [
      'React',
      'Redux',
      'Socket.io',
      'Jest',
      'React Testing Library',
      'Figma',
    ],
    cover: {
      type: 'image',
      src: '/work/ayomi/dashboard.webp',
      width: 2296,
      height: 2138,
      alt: 'Ayomi campaign dashboard: next actions, campaign calendar, amount raised and statistics',
      layout: 'full',
    },
    gallery: [],
  },
  {
    slug: 'ayomi-customer-care',
    name: 'Ayomi Customer Care CRM',
    shortName: 'Ayomi CRM',
    client: 'Ayomi',
    role: 'UI/UX designer & front-end developer',
    year: '2022',
    color: 'green',
    stickerBack: 'orange',
    tags: ['Fintech', 'Internal tool', 'React'],
    pitch: 'A CRM that gives the Customer Care team every answer in one place.',
    summary: [
      'Entrepreneurs raising funds with Ayomi dealt with many teams: structuring, marketing, investor relations, legal, support. They often did not know who to ask, and the Customer Care team had to search several tools for each answer.',
      'Working with a backend developer and the product owner, I designed and built a CRM that gathers everything about a client on one screen: fundraising status, KYC verification, appointments, related projects and comments.',
    ],
    challenge: [
      'Understand the real needs of a team that knows its job far better than we do.',
      'Keep the interface fast with thousands of clients, on every machine of the team.',
      'Ship a reliable internal tool in three weeks, then keep improving it.',
    ],
    answer: [
      'Three weeks of process: questioning the operational teams, listening to client calls and reading the support chat, then prioritising quick wins for an MVP, wireframes and feedback before building.',
      'Optimistic UI so users never wait for the server, virtualised lists that render only what is on screen, and code splitting for a faster first load.',
      'Test-driven development for each component, every state documented in Storybook, and a dedicated Telegram chat with the team to collect feedback after each new feature.',
    ],
    focus: {
      title: 'Built with its users',
      body: [
        'Very few incoming support tickets after launch.',
        'New features added one by one based on their impact on the Customer Care team, such as adding an investor or listening to past calls.',
      ],
    },
    stack: [
      'React',
      'Redux',
      'React Virtualized',
      'Jest',
      'React Testing Library',
      'Storybook',
      'Figma',
    ],
    cover: {
      type: 'image',
      src: '/work/ayomi/care-client.webp',
      width: 2087,
      height: 1558,
      alt: 'Ayomi Customer Care CRM: client profile with fundraising details, team in charge, appointments and comments',
      layout: 'full',
    },
    gallery: [
      {
        type: 'image',
        src: '/work/ayomi/care-list.webp',
        width: 1950,
        height: 1460,
        alt: 'Ayomi Customer Care CRM: searchable client list with contact details, project, type and status',
        layout: 'full',
      },
    ],
  },
  {
    slug: 'agenda-lausanne',
    name: 'Lausanne Events Calendar',
    client: 'City of Lausanne',
    role: 'Lead dev',
    year: '2025',
    color: 'orange',
    stickerBack: 'green',
    tags: ['Lead dev', 'React', 'Tailwind'],
    pitch: 'Hundreds of events to explore by theme, by date or by venue.',
    summary: [
      'The City of Lausanne’s events calendar brings together exhibitions, concerts, kids’ activities and neighbourhood events for every audience.',
      'Three entry points lead to the same content: suggestions by theme, a filterable calendar and a map of venues.',
    ],
    challenge: [
      'A public service used by the whole population: it has to be fast, accessible, and let you find an outing in seconds among hundreds of events.',
    ],
    answer: [
      'A calendar with simple filters (indoors, evening, free…), a map that groups events by venue, and editorial picks for inspiration.',
      'I led the development, working with another another developper.',
    ],
    focus: {
      title: 'Three entry points, one set of content',
      body: [
        'By theme for inspiration, by date to plan ahead, by venue to go out nearby: all three views share the same data and the same filters.',
      ],
    },
    stack: ['React', 'Vite', 'CMS Nova'],
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

// Smaller projects, listed after the case studies on /work (no detail page).
export interface OtherProject {
  name: string;
  role: string;
  // Agency or company the project was done with.
  company?: string;
  stack: string[];
  // One line of context, under the name.
  note?: string;
  url?: string;
}

export const OTHER_PROJECTS: OtherProject[] = [
  {
    name: 'Vaudoise Arena',
    role: 'Maintenance',
    company: 'Superhuit',
    stack: ['Vue.js', 'Nuxt', 'Strapi'],
    note: 'Took over the site when the client moved its account to Superhuit.',
    url: 'https://www.vaudoisearena.ch/',
  },
  {
    name: 'Tipee',
    role: 'Front-end developer (support)',
    company: 'Superhuit',
    stack: ['WordPress (headless)', 'Next.js'],
    url: 'https://www.tipee.ch/',
  },
  {
    name: 'Pulse Up',
    role: 'Front-end developer (support)',
    company: 'Superhuit',
    stack: ['WordPress (headless)', 'Next.js'],
    url: 'https://www.pulsemedica.ch/',
  },
  {
    name: 'Conciergerie Océanis',
    role: 'Design & lead dev',
    company: 'Side project',
    stack: ['WordPress (headless)', 'Next.js'],
    url: 'https://www.conciergerie-oceanis.fr/',
  },
];

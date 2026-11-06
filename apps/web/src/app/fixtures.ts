import type { Category, FitTag } from '@tryitout/shared';

/**
 * Demo fixtures — implementation.md §15 Phase 1 task 5.
 *
 * This is the mockup data from design/screens, and the golden data from §11.3. It is
 * test material only: §0 is explicit that Aarav, 98 cm and "88% sure" must never be
 * shown to a real user as fact. Demo mode (`?demo=1`) and the visual tests are the only
 * places it is allowed on screen.
 */

export type DemoBrand = {
  slug: string;
  name: string;
  monogram: string;
  note: string;
  size: string;
  fitTag: FitTag;
};

export type DemoProfile = {
  firstName: string;
  initial: string;
  heightCm: number;
  weightKg: number;
  ageYears: number;
  shape: 'slim' | 'athletic' | 'regular' | 'broad';
  fitPref: 'slim' | 'regular' | 'relaxed';
  measurements: { chest: number; waist: number; hip: number; shoulder: number; inseam: number };
  anchor: { brand: string; category: Category; size: string };
};

export const demoProfile: DemoProfile = {
  firstName: 'Aarav',
  initial: 'A',
  heightCm: 175,
  weightKg: 72,
  ageYears: 24,
  shape: 'athletic',
  fitPref: 'regular',
  measurements: { chest: 98, waist: 84, hip: 96, shoulder: 45, inseam: 78 },
  anchor: { brand: 'Roadster', category: 'tshirt', size: 'M' },
};

/** The §11.3 golden result: these six rows are what the size engine must reproduce. */
export const demoBrands: DemoBrand[] = [
  {
    slug: 'zara',
    name: 'Zara',
    monogram: 'Z',
    note: 'True to size for you',
    size: 'M',
    fitTag: 'great',
  },
  {
    slug: 'uniqlo',
    name: 'Uniqlo',
    monogram: 'U',
    note: 'Regular cut suits your shoulders',
    size: 'M',
    fitTag: 'great',
  },
  {
    slug: 'roadster',
    name: 'Roadster',
    monogram: 'R',
    note: 'Matches the M you own',
    size: 'M',
    fitTag: 'great',
  },
  {
    slug: 'hm',
    name: 'H&M',
    monogram: 'H&M',
    note: 'Runs small at the chest',
    size: 'L',
    fitTag: 'good',
  },
  {
    slug: 'snitch',
    name: 'Snitch',
    monogram: 'S',
    note: 'Slim cut, M is tight at chest',
    size: 'L',
    fitTag: 'good',
  },
  {
    slug: 'zudio',
    name: 'Zudio',
    monogram: 'Zu',
    note: 'You are between M and L',
    size: 'L',
    fitTag: 'slightly_loose',
  },
];

export const demoBrandDetail = {
  brand: 'Zara',
  category: 'T-shirts',
  fitLine: 'regular',
  size: 'M',
  fitTag: 'great' as FitTag,
  confidence: '88% sure',
  basis: 'Based on your measurements and the Roadster M you own.',
  alternatives: [
    { size: 'S', word: 'Tight' },
    { size: 'M', word: 'Great' },
    { size: 'L', word: 'Loose' },
  ],
  regions: [
    { name: 'Chest', ease: '+6 cm', value: 0.5 },
    { name: 'Waist', ease: '+10 cm', value: 0.62 },
  ],
  facts: [
    { label: 'Length', value: 'Ends at mid-hip' },
    { label: 'Shoulder seam', value: 'Right on your shoulder' },
    { label: 'Sleeve', value: 'Ends mid upper-arm' },
    { label: 'Same size elsewhere', value: 'IN 40 · US M · EU 50' },
  ],
};

export const demoBuild = {
  brand: 'Snitch',
  type: 'Oversized crew tee',
  size: 'L',
  stats: [
    { label: 'Chest', value: '116 cm' },
    { label: 'Length', value: '74 cm' },
    { label: 'Sleeve', value: '24 cm' },
  ],
  steps: [
    { label: 'Cut out of your photo', sub: 'Background removed', state: 'done' as const },
    {
      label: 'Sewing pattern read',
      sub: 'Front, back, 2 sleeves, neck rib',
      state: 'done' as const,
    },
    { label: 'Set to size L', sub: "From Snitch's size chart", state: 'done' as const },
    {
      label: 'Draping on your body',
      sub: 'Cloth physics on your 175 cm, athletic build',
      state: 'running' as const,
      progress: 0.7,
    },
    { label: 'Open live camera', sub: 'See it move with you', state: 'pending' as const },
  ],
};

export const demoShareCheck = {
  brand: 'H&M',
  productType: 'Regular-fit oxford shirt',
  sizesOnPage: 'S, M, L, XL',
  size: 'L',
  fitTag: 'good' as FitTag,
  confidence: '85% sure',
  store: 'Myntra',
  notes: [
    { label: 'Chest', mono: '+8 cm', value: ', comfortable room', warn: false },
    { label: 'Length', value: 'Covers your belt, tucks well', warn: false },
    { label: 'In M', value: 'Tight across the chest', warn: true },
  ],
  basis: "Based on H&M's size chart and 3 shirts you kept.",
};

export const demoPurchase = {
  brand: 'H&M',
  product: 'Regular fit cotton shirt',
  size: 'L',
  saidFit: 'Good fit',
  delivered: 'Delivered on 2 November',
};

/** 3.4's family switcher (V2, flag `familyProfiles`) and tools grid. */
export const demoFamily = [
  { initial: 'A', name: 'Aarav', note: 'You', tone: 'ink' as const },
  { initial: 'M', name: 'Maa', note: 'Kurtas', tone: 'tight' as const },
  { initial: 'P', name: 'Papa', note: 'Shirts', tone: 'loose' as const },
  { initial: 'R', name: 'Riya', note: 'Age 8', tone: 'great' as const },
];

/** 3.3 Store mode (V2, flag `storeMode`). */
export const demoStore = {
  stores: ['Zudio', 'Max', 'Westside', 'Pantaloons', 'Trends'],
  categories: ['T-shirts', 'Shirts', 'Jeans', 'Trousers', 'Kurtas', 'Shoes'],
  store: 'Zudio',
  category: 'T-shirts',
  fitLine: 'regular',
  size: 'L',
  fitTag: 'slightly_loose' as FitTag,
  note: 'M will feel tight across your chest.',
};

/** 4.1's desktop dashboard: the wider table, the usual sizes and the recent checks. */
export const demoDesktop = {
  greeting: 'Hi Aarav. Your size and fit in every brand you shop.',
  measurementsNote: 'From a body scan · High accuracy',
  usualSizes: [
    { label: 'Tops', value: 'M–L' },
    { label: 'Jeans', value: '32' },
    { label: 'Kurtas', value: 'L' },
    { label: 'Shoes', value: 'UK 9' },
  ],
  review: {
    badge: '1 to review',
    title: 'Did your H&M shirt fit?',
    body: 'It arrived yesterday. Your answer tunes every H&M size after this.',
    cta: 'Tell us',
  },
  categories: ['Tops', 'Shirts', 'Jeans', 'Kurtas', 'Shoes'],
  rows: [
    {
      monogram: 'R',
      brand: 'Roadster',
      size: 'M',
      fitTag: 'great' as FitTag,
      note: 'Matches the M you own',
      confidence: 92,
    },
    {
      monogram: 'Z',
      brand: 'Zara',
      size: 'M',
      fitTag: 'great' as FitTag,
      note: 'Chest +6 cm, length right',
      confidence: 88,
    },
    {
      monogram: 'U',
      brand: 'Uniqlo',
      size: 'M',
      fitTag: 'great' as FitTag,
      note: 'Easy room in the shoulders',
      confidence: 86,
    },
    {
      monogram: 'H',
      brand: 'H&M',
      size: 'L',
      fitTag: 'good' as FitTag,
      note: 'M is tight in the chest',
      confidence: 85,
    },
    {
      monogram: 'L',
      brand: "Levi's",
      size: 'M',
      fitTag: 'good' as FitTag,
      note: 'Slim tees: go up to L',
      confidence: 82,
    },
    {
      monogram: 'S',
      brand: 'Snitch',
      size: 'L',
      fitTag: 'good' as FitTag,
      note: 'Oversized cuts: stay at L',
      confidence: 80,
    },
    {
      monogram: 'A',
      brand: 'Allen Solly',
      size: '40',
      fitTag: 'good' as FitTag,
      note: 'Formal shirts in chest sizes',
      confidence: 79,
    },
    {
      monogram: 'Z',
      brand: 'Zudio',
      size: 'L',
      fitTag: 'slightly_loose' as FitTag,
      note: 'M runs tight in the chest',
      confidence: 78,
    },
  ],
  recent: [
    {
      title: 'H&M oxford shirt',
      sub: 'Shared from Myntra · Good fit',
      size: 'L',
      to: '/check',
      kind: 'oxford' as const,
    },
    {
      title: 'Snitch oversized tee',
      sub: '3D try-on saved · Good fit',
      size: 'L',
      to: '/try/studio/demo',
      kind: 'tee' as const,
    },
    {
      title: 'Zara linen shirt',
      sub: 'Searched · Great fit',
      size: 'M',
      to: '/sizes/zara/tshirt',
      kind: 'linen' as const,
    },
  ],
  promo: {
    title: 'See it on you first',
    body: 'Drop any shirt photo. We rebuild it in 3D from real measurements and put it on your body.',
    cta: 'Open try-on studio',
  },
  searchPlaceholder: "Search any brand, like Levi's or Biba",
  measureAgain: 'Measure again',
  fitTitle: 'Best fit for you',
  fitSub: 'Your size in each brand, based on its size chart and what you kept',
  greatFitOnly: 'Great fit only',
  sort: 'Sort: Best fit',
  privacyNote: 'Scan photos are deleted right after measuring.',
  switchProfile: 'Switch profile',
};

/** 4.2's try-on studio: the garment panel, the stage and the three note cards. */
export const demoStudio = {
  subtitle: 'Snitch oversized crew tee · comparing M and L on your body',
  brand: 'Snitch',
  style: 'Oversized tee',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  selected: 'L',
  compare: 'M',
  sizeCaption: 'L is your size at Snitch. Pick up to two to compare.',
  chartTitle: "Garment size L · from Snitch's chart",
  chart: [
    { label: 'Chest', value: 116 },
    { label: 'Length', value: 74 },
    { label: 'Sleeve', value: 24 },
  ],
  verdict: {
    chip: 'Good fit in L',
    line: 'L is your size for this tee. Biceps feel snug in both sizes.',
  },
  notes: [
    {
      region: 'Chest',
      rows: [
        { size: 'M', value: '+12 cm', tag: 'Snug', tone: 'tight' as const },
        { size: 'L', value: '+18 cm', tag: 'Just right', tone: 'great' as const },
      ],
    },
    {
      region: 'Biceps',
      rows: [
        { size: 'M', value: '−1 cm', tag: 'Tight', tone: 'tight' as const },
        { size: 'L', value: '+2 cm', tag: 'Snug', tone: 'tight' as const },
      ],
    },
    {
      region: 'Length',
      rows: [
        { size: 'M', value: 'At your belt', tag: 'Short', tone: 'tight' as const },
        { size: 'L', value: 'At your hip', tag: 'Just right', tone: 'great' as const },
      ],
    },
  ],
};

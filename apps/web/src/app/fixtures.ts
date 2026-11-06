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
  brand: 'Snitch',
  productType: 'Oversized tee',
  size: 'L',
  fitTag: 'great' as FitTag,
  confidence: 'High confidence',
  notes: [
    { label: 'Chest', value: '+8 cm room' },
    { label: 'Length', value: 'Ends at your hip' },
    { label: 'In M', value: 'Tight at the chest' },
  ],
  basis: 'Based on Snitch’s size chart.',
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

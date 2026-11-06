import { z } from 'zod';

/**
 * The product's locked vocabulary — implementation.md §9 (the Postgres enum types).
 * Web, Edge Functions and tests all read these, so a value can never drift between
 * the database, an API contract and a UI chip.
 */

export const Gender = z.enum(['man', 'woman', 'other']);
export const Shape = z.enum(['slim', 'athletic', 'regular', 'broad']);
export const FitPref = z.enum(['slim', 'regular', 'relaxed']);
export const FitStyle = z.enum(['slim', 'regular', 'relaxed', 'oversized']);
export const MeasureSource = z.enum(['typed', 'scan', 'anchor_only']);
export const Category = z.enum([
  'tshirt',
  'oversized_tee',
  'polo',
  'shirt',
  'jeans',
  'trousers',
  'kurta',
  'shoes',
]);
export const ChartKind = z.enum(['body', 'garment']);
export const FitTag = z.enum([
  'great',
  'good',
  'slightly_tight',
  'slightly_loose',
  'not_recommended',
]);
export const BuildStatus = z.enum(['queued', 'running', 'done', 'failed']);
export const Verdict = z.enum(['too_tight', 'perfect', 'too_loose']);
export const Keep = z.enum(['keeping', 'returning', 'not_sure']);
export const VoteChoice = z.enum(['looks_good', 'not_sure', 'skip_it']);

/** Confidence is shown as a level; the percentage stays hidden until calibrated (§11.3). */
export const ConfidenceLevel = z.enum(['high', 'medium', 'low']);

/** Body regions the size engine scores and the feedback sheet collects (§11.3, §9). */
export const Region = z.enum([
  'chest',
  'waist',
  'hip',
  'shoulder',
  'sleeve',
  'inseam',
  'neck',
  'length',
  'biceps',
]);

/** V1 ships tops only (§1). Everything else stays "Coming soon" on the dashboard. */
export const V1_CATEGORIES = [
  'tshirt',
  'oversized_tee',
  'polo',
  'shirt',
] as const satisfies readonly z.infer<typeof Category>[];

export type Gender = z.infer<typeof Gender>;
export type Shape = z.infer<typeof Shape>;
export type FitPref = z.infer<typeof FitPref>;
export type FitStyle = z.infer<typeof FitStyle>;
export type MeasureSource = z.infer<typeof MeasureSource>;
export type Category = z.infer<typeof Category>;
export type ChartKind = z.infer<typeof ChartKind>;
export type FitTag = z.infer<typeof FitTag>;
export type BuildStatus = z.infer<typeof BuildStatus>;
export type Verdict = z.infer<typeof Verdict>;
export type Keep = z.infer<typeof Keep>;
export type VoteChoice = z.infer<typeof VoteChoice>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>;
export type Region = z.infer<typeof Region>;

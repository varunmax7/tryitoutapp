# Tryitout design pack

These files are the source of truth for how every screen looks. Put this `design/` folder at the repo root.

- `screens/*.png`: exact renders of each artboard. Phone screens are 390×844 at 2x (780×1688 px). Desktop screens are 1440 px wide at 1x.
- `reference/*.html`: the same screens as standalone HTML with inline styles. Open them in a browser to read exact sizes, colours, spacing and copy. Links between screens work.

The canvas used the placeholder name "FitSaathi". Every file here has been renamed to **Tryitout**.

## Screen index

| File | Route in the app | Ships in | Notes |
|---|---|---|---|
| 1.1-welcome | `/` | V1 | Onboarding entry. No login. |
| 1.2-type-my-details | `/measure` | V1 | Step 1 of 2. Step 2 is "Your numbers" (to be built, see implementation.md §12.6). |
| 1.3-scan-me | `/scan` | V1 | Front photo shown. The side photo uses the same layout with "Side photo · 2 of 2". |
| 1.4-my-sizes | `/sizes` | V1 | Mobile dashboard. |
| 1.5-brand-fit-detail | `/sizes/:brand/:category` | V1 | |
| 2.1-try-it-on | `/try` | V1 | |
| 2.2-building-3d-try-on | `/try/build/:buildId` | V1 | Progress is live from the build job. |
| 2.3-live-fit-check | `/try/live/:garmentId` | V1 | Camera view. The person is an illustration standing in for the live camera feed. |
| 3.1-share-to-check | `/check` | V1 | Bottom sheet over another shopping app. The background page is a neutral placeholder. |
| 3.2-did-it-fit | `/did-it-fit/:purchaseId` | V1 | |
| 3.3-store-mode | `/store` | V2 | Hidden behind a feature flag in V1. |
| 3.4-me-family-tools | `/me` | V1 (profile + privacy), V2 (family + tools) | V2 tiles are hidden behind feature flags in V1. |
| 4.1-web-my-sizes | `/sizes` at ≥1024 px | V1 | Desktop layout of the dashboard. |
| 4.2-web-try-on-studio | `/try/studio/:garmentId` at ≥1024 px | V1 | Desktop try-on. |

## Rules for building from these screens

1. Match the screens. The visual test compares each route against its PNG (see implementation.md §17.4).
2. Use design tokens, never raw hex values in components. Every hex value in `reference/*.html` maps to a token in implementation.md §12.2.
3. The people, names (Aarav, Maa, Papa, Riya), measurements, percentages and products in the screens are sample data. Use them only as test fixtures.
4. Brand names appear as plain text with an initial. Never add brand logos.
5. Illustrations in the camera screens stand in for the live camera feed and the 3D render.

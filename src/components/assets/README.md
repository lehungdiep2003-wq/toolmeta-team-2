# Asset Management showcase

Only `FeatureGroups` in App.tsx uses `AssetShowcase`. The original shared
`MiniTable` and the other product-preview section remain unchanged. All styles
are scoped to `#features`; no Hero/Benefits files, routing or dependencies change.

## Components and data

- `AssetShowcase.tsx`: existing copy plus the live illustrative table, local
  manual control state and background decoration.
- `AssetTable.tsx`: semantic table, labeled checkboxes, search/status controls,
  selected rows and stable dimmed rows. Every phase retains all three rows.
- `assetShowcaseData.ts`: existing names, statuses, masked AD IDs, roles and
  timestamps. AD balance/spend, BM IDs/company and Page IDs were not supplied
  in source, so they use an explicitly labeled em dash. No follower column is
  added because the existing Page example has no follower data. Reference-image
  figures are not imported as verified source data.
- `useAssetAutoplay.ts`: per-card IntersectionObserver, visibility/preference
  listeners and a separate clock. It reuses the read-only generic `DemoPlayback`
  class from Benefits without modifying that section or its controllers.

## Timelines

AD (10.8s): focus 1s, type North 1.5s, dim 2.5s, highlight 3.5s,
select 4.5s, filter 5.5s, status 6.5s, hold 8s, reset 9.5s.

BM (11.2s): focus 1s, type Project 1.5s, highlight 3s, filter hint 4s,
filter active 5s, select 6s, role/status emphasis 7s, hold 8.5s, reset 10s.

PAGE (11s): focus 1s, type Green 1.5s, dim 2.5s, highlight 3.5s,
select 4.5s, permission emphasis 5.5s, status 7s, hold 8.5s, reset 10s.

Each table starts only after 45% of its displayable panel area is visible; copy
alone on screen never starts a table below the fold. Other tables stay paused.
Offscreen/hidden-tab clocks pause and resume elapsed time.
Focus/input/checkbox interaction takes over only that table; after focus and
pointer leave, a 1.4s quiet period resets the illustration and restarts it.
No real focus, API calls, destructive actions or user-account data are involved.

## Responsive and motion

Desktop >=1024px keeps copy left/table right. Below 1024px each block stacks
copy before table. Tables keep readable 12px metadata/13px primary text and
56px rows, with internal horizontal scroll rather than scaling/hiding columns.
Mobile inputs/filter hit areas are 44px; checkbox labels have enlarged hit areas.
Decorative particles have independent phases; glow and dashed-path flow pause
with their card. Reduced motion disables autoplay/decorative motion while
local search/filter/selection remains usable. No live region announces demo
changes; focus within a table pauses the demo for assistive-technology users.

## Validation

Artifacts and scheduler/SSR/scope tests: `.tmp/asset-showcase/`.
Browser inventory was empty during implementation. Actual desktop/tablet/mobile
rendering, clipping/overflow and OS reduced-motion QA remain unverified; source,
TypeScript/build and deterministic clock tests are not browser proof.

When browser access is available, inspect 1440x900, 1024x768, 768x1024,
430x932, 390x844 and 360x800. Watch each card for at least 12s, verify that
only visible cards run, check pause/resume, focus/manual takeover, checkbox
labels, internal horizontal scrolling and reduced motion.

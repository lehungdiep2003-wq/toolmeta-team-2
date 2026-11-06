# Core Benefits visual components

Benefits retain the existing four-card Bento and all heading/benefit copy.
The desktop grid is 280px + 280px with an 18px gap (previously 568px total,
now 578px). Below 1200px it becomes a two-column composition; below 768px
it follows the existing content order in one column. CSS is scoped to `#benefits`.

Icons are supplied through `renderIcon`, reusing the application's existing
icon paths without changing the shared icon component or adding dependencies.

- `BenefitAssetStack`: 6.2s autoplay sequence, AD at 0s, BM at 1s, PAGE at 2s,
  shared edge highlight at 3s, glow at 4s, reset at 5s. The sequence wrapper
  lifts 8px (5px mobile) outside each card's unchanged perspective transform.
- `BenefitSearchDemo`: controlled `query`, `assetType`, `status` and matching
  callbacks. Each 6.6s cycle focuses visually, types BM/PAGE/AD in rotation,
  selects the corresponding chip, highlights status and briefly shows a row
  explicitly labeled as illustrative. Desktop reserves that row's height;
  below 1200px the optional row is omitted to retain the approved card sizing.
  No real focus, backend query, user data or API operation is involved.
- `BenefitBulkDemo`: controlled `selected` and `phase` plus optional `onAction`.
  The 7.2s demo selects assets at .5/1/1.5s, emphasizes the count at 2s,
  hints at 2.8s, presses at 3.5s, confirms at 4s and resets at 6.5s.
  Users can take over selection and run the same visual confirmation manually;
  no default handler calls a product operation or network API.
- `BenefitWorkflow`: controlled `activeStep`; its 6.6s sequence highlights steps
  at 0/1.8/3.5s, advances lines at 1/2.8s, shows the badge at 4s, resets at 6s.
  It illustrates organization/tracking/completion, without claiming automation.

`BenefitsMotionProvider` starts playback when at least 55% of the displayable
section area is visible. The threshold is capped by the available viewport, so
it is reachable for tall mobile layouts. Playback pauses outside the viewport
or in a hidden tab and resumes its elapsed time. Entrance remains once-only.

`BenefitDemoCard` supplies independent 0/600/1200/1800ms starting delays. Hover,
focus and user input pause only that card; leaving the card and releasing focus
resets/restarts it after 1.4s. Focused fields keep ownership so automatic typing
never overwrites ongoing input. Manual takeover is no longer permanent.

`DemoPlayback` owns one sparse phase timer per card and supports pause/resume,
reset and cleanup; its injectable scheduler permits deterministic lifecycle
tests. `useDemoTimeline` is the React adapter. No intervals, frame-by-frame React
updates, API calls, keyboard focus changes or new dependencies are used.

Fine pointers retain 4px card hover lift; mobile uses smaller lift and 44px
controls. Autoplay does not depend on hover. Reduced motion disables loops and
uses static search, selected bulk assets and the completed workflow state.

Changed files: App.tsx; BenefitDemoCard.tsx, DemoPlayback.ts, demoVisibility.ts
(new); BenefitsMotionProvider.tsx, useDemoTimeline.ts, demoTimelines.ts,
BenefitAssetStack.tsx, BenefitSearchDemo.tsx, BenefitBulkDemo.tsx,
BenefitWorkflow.tsx, benefits.css and this README.

Validation records are in `.tmp/benefits-autoplay/`. Deterministic scheduler
tests exercise four independent auto-starts without hover/click, every phase,
looping, global/per-card pause/resume, safe reset/restart and timer cleanup.
Visibility math includes tall mobile layouts. TypeScript/build and SSR checks
verify scope and original copy. Browser inventory is empty, so none of the four
demos has been visually verified in an actual browser in this round. Desktop,
mobile, real OS reduced-motion and visible layout/overflow QA remain pending.

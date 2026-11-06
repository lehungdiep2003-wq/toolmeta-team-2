# Hero visual layers

`HeroVisual` composes a `900 × 650` desktop/tablet SVG and a separately assembled
`560 × 760` mobile SVG. Its child order is the paint
order: background, AD/BM/PAGE, notification, core, shield, analytics, cursor,
foreground particles, then caption. Keep this order when replacing assets.

- `heroVisual.config.ts` owns image references, default placement, animation and
  existing example values. Keep future PNG/WebP/SVG imports here.
- `heroPolish.ts` owns the PA2 contact/cast shadow hierarchy. `HeroDefinitions`
  defines materials, rim lighting and focused ambient glow using instance-scoped
  SVG resources; the original logo image remains unchanged.
- `heroMobileLayers` repositions and uniformly scales the same components below
  768px; it does not shrink the entire desktop scene. `useHeroMobileLayout`
  subscribes to the breakpoint and preserves a deterministic server snapshot.
- The nine primary layers stay within the viewBox. Ambient light is intentionally
  contained by the SVG viewport so it cannot create horizontal page overflow.
  Foreground particles and the example-data caption remain auxiliary layers.
- Each component accepts `presentation` (x/y, uniform scale, angle, rotation
  origin, skewX, opacity, animation) and `image` (URL, optional local bounds).
- `AssetCard` takes `variant="AD"`, `"BM"` or `"PAGE"` plus editable title/value.
  `NotificationCard` accepts editable title/lines; `HeroCaption` accepts text.
- Image replacements occupy the component's local SVG bounds and preserve their
  aspect ratio. Override `bounds: [x, y, width, height]` for transparent padding.
  The wrapper retains placement, stacking and animation.
- `HeroLayer` animates in scene coordinates outside its placement transform.
  `heroMotion.ts` owns Round 4 timing, phase, amplitude and motion kind; placement
  stays in `heroVisual.config.ts`. Override `presentation.animation` per layer,
  or pass `false` to disable it. Core completes its float/return in 6 seconds;
  cards have independent phases. Distances are rendered CSS pixels, compensated
  for viewBox scaling on resize. Tablet uses 70% travel and mobile 50%.
  Mobile keeps core/cards, notification, analytics and shield floating; cursor,
  particle orbits and glow loops are disabled there.
- `heroVisual.css` owns the once-per-entry CSS entrance, scoped CTA hover/focus,
  subtle glow breathing, dashed-orbit flow and two particle motions. No loop
  changes React state, layout, metrics, blur or materials. Reduced motion disables
  entrance/decorative transforms while keeping content visible and focus clear.
- `HeroSvgResources` scopes gradients/filters using React `useId`. To compose
  components outside `HeroVisual`, render them inside an SVG with
  `<HeroSvgResources><HeroDefinitions />…</HeroSvgResources>` and import
  `heroVisual.css`. Give the SVG a title/description or mark it decorative.

```tsx
<HeroVisual
  layers={{ core: { scale: 1.05 }, ad: { animation: false } }}
  assets={{ layers: { cursor: { src: cursorWebp, bounds: [-5, 3, 82, 82] } } }}
/>
```

`src/HeroArtwork.tsx` remains the compatibility entry point for `App.tsx`.

Round 5 adapts the outer Hero grid without changing layer coordinates/materials:
the existing site maximum width bounds desktop, tablet uses one column, and
mobile keeps the independent portrait composition. Mobile CTA targets are 50px
high; text remains first in DOM order and the quick-start product name stays
together when wrapping. All responsive rules are scoped to the Hero.

`HeroVisual` supplies intrinsic SVG dimensions, a separate accessible title and
description, and stays outside keyboard navigation. `useHeroMotionActivity`
pauses decorative loops offscreen or while the document is hidden, without
per-frame React updates. It also releases the core's `will-change` while paused.
The existing reduced-motion rules still disable entrance and decorative loops.

QA records/screenshots live in `.tmp/hero-round5/`. Existing eyebrow and
quick-start secondary text colors fall below AA small-text contrast on white;
they are preserved because this round explicitly prohibits palette changes.

Round 5.1 compacts only the mobile assembly: vertical gaps close between the
three asset cards and core, with analytics lifted below them and the shield
at the core's upper-right rim. Primary asset scales, angles and motion stay
unchanged. The shorter 760-unit viewBox retains shadow/float gutters; the
background orbit is slightly smaller to stay inside the mobile viewport.
Desktop/tablet placement and outer styles remain unchanged. QA is recorded in
`.tmp/hero-round5-1/`.

Round 4.1 makes existing component motion perceptible without changing placement:
core travels 10px/6s; AD 7px/5.5s, BM 9px/6.8s, PAGE 8px/6.2s,
notification 6px/7.5s, analytics 5.5px/8.5s, shield 4.5px/8s.
The cursor follows a short 10px drift over 6.8s. Two existing background particles
use CSS motion paths (13s/17s), behind every card, without rotating the orbit.
Reduced motion removes both looping animations and particle motion paths.
Browser frames and computed transforms at 0/2/5/10 seconds are in
`.tmp/hero-round4-1/`; these exercise the actual app, not a CSS-only demo.

The interaction upgrade uses `useHeroInteraction`: a single WAAPI cursor travel
timeline with sparse phase-boundary timers, without React frame updates or real
click events. Desktop/tablet visits PAGE → BM → AD → notification → analytics
in 14.4s; mobile visits PAGE → AD → analytics in 9.9s. Each leg takes 1.2–1.8s,
followed by hover 650ms, press 250ms, and release 200ms; the final return takes
1.5s. Anchors are read from each layer's approved SVG placement matrix.

`HeroLayer` keeps float, simulated interaction and static placement in separate
groups. The target group exposes `data-state="idle|hovered|clicked"`. Feedback
uses 3px lift, 2px press/release, a small icon scale and a brief cursor ring;
existing colors, card shadows and materials are preserved. The two formerly
static green dots have 4.8s/6.3s floats; mobile also gives the other two dots
gentle floats instead of orbital travel. Reduced motion cancels WAAPI and
clears simulated states; offscreen/document visibility pauses the common clock.
QA frames, timeline samples and reduced-motion fixture are in
`.tmp/hero-interaction/`.

# Expressive Lab Integration Plan

## Objectives
- Preserve the cinematic, research-heavy spirit from `new-ideas-1.html` through `new-ideas-5.html` while keeping everything inside our React + TypeScript + Vite toolchain.
- Keep the new Expressive Lab route entirely section-driven so individual studies can be reordered or promoted onto the main performance when they are production-ready.
- Avoid ad-hoc script tags by centralizing animation runtimes (GSAP + ScrollTrigger, optional Framer Motion) and exposing them through typed hooks/components.

## Shared Architecture & Tooling
1. **Router surface.** We now expose the lab at `/expressive-lab`. Every study should be a `<LabSection>` component that receives metadata (id, source file, dependencies) so routing, analytics, and future scheduling stay trivial.
2. **Section registry.** Create `src/sections/index.ts` exporting an ordered array of section configs `{ id, source, component, status }`. Expressive Lab iterates over this registry; the main page can import the same data to cherry-pick sections.
3. **Animation utilities.**
   - `useGSAPTimeline` hook that registers ScrollTrigger once, accepts refs, and tears down timelines when sections unmount.
   - `SliderControl` and `RangePlayground` primitives with shared styling + accessibility; idea 2 & 4 reuse them.
   - Decide per-section whether GSAP (scroll-based) or Framer Motion (micro-interactions) is the right tool; expose both but ensure only one runtime loads per section to prevent bloat.
4. **Design tokens.** Reuse existing CSS variables (`--bg`, `--ink`, Fraunces variable font helpers) plus a `SectionTheme` context for background gradients or dark-on-light switches each idea needs.
5. **Content data.** Copy copy decks (headlines, subheads, quotes) into JSON/TypeScript modules so the same language can populate multiple variants without editing JSX.

## Idea Source Mapping

### Idea 01 — Immersive Scroll Narrative (`new-ideas-1.html`)
- **Port:** Hero gradient intro, scale ladder, weight samples, rhythm cards, spacing ladder, voice grid, negative-space “Silence,” closing gratitude.
- **Plan:**
  - Break each block into `SectionHero`, `ScaleStack`, `WeightSpectrum`, etc.; wrap animations with `useGSAPTimeline` so ScrollTrigger is registered once at section mount.
  - Replace inline event handlers (click-to-scale, hover-to-expand) with declarative state hooks. Keep typography tokens (font size, weight, letter-spacing) in arrays so they can be reused elsewhere.
  - Negative space section becomes a reusable `<SilencePanel>` that simply renders children and accepts `minHeight` + `caption` props.

### Idea 02 — Stepwise Study Deck (`new-ideas-2.html`)
- **Port:** Micro hero, numbered chapters, tracking slider, rhythm guidance, voice cards, silence hover box, outro CTA.
- **Plan:**
  - Build a `ScrollStep` component replicating the IntersectionObserver reveal but tied to React refs; uses CSS transitions instead of manual class toggling.
  - Promote the slider into `SliderControl` so the label text next to it updates; feed values into a `TrackingDemo` component controlling letter-spacing on sample text rather than the slider label (fixing current behavior).
  - Convert voice cards + silence box into `FeatureCard` primitives to share spacing + focus states.

### Idea 03 — React + GSAP Pinned Story (`new-ideas-3.html`)
- **Port:** Fixed header, hero word stagger, scale pin section, weight stack, spacing sticky experiment, horizontal typeface carousel, silence grid, footer.
- **Plan:**
  - Since this file already uses React, move the components into `src/sections/idea3/*` and swap inline Babel for TypeScript modules.
  - Abstract pinned sections into a `PinnedViewport` component (wraps `SectionIntro`, handles `ScrollTrigger` pin). Base hero words on existing `AnimatedText` primitive so typography stays coherent.
  - Horizontal carousel becomes a `ScrollSnapTrack` that accepts cards, making it easy to remix into the main page.

### Idea 04 — Interaction Deck with Sliders (`new-ideas-4.html`)
- **Port:** Hero, introduction copy, alternating sections with slider-driven demos (scale, weight, rhythm, spacing, typeface voice, negative space), conclusion.
- **Plan:**
  - Refactor slider state so each slider updates typography samples rendered next to it (per the TODO in the file). `SliderControl` from the shared layer supplies consistent markup, labeling, and keyboard interactions.
  - Build a `SplitSection` layout component to enforce the alternating layout (text column vs demo column) with handedness props.
  - Extract GSAP reveal logic into a single `useRevealOnScroll` hook shared by all sections; no inline `gsap.utils.toArray` calls.

### Idea 05 — Framer Motion Chapters (`new-ideas-5.html`)
- **Port:** Progress bar, staged hero, ChapterScale, ChapterWeight (mouse-position weight painting), ChapterRhythm (dual sliders), and supporting quotes.
- **Plan:**
  - Install Framer Motion once at the app level; lazy-load Chapter components inside the lab route so the main page isn’t forced to ship it until we promote the sections.
  - Wrap each chapter inside `<LabSection>` for consistent spacing but let Framer Motion control local transitions.
  - Map their slider/knob state to the same `SliderControl` primitive for UI consistency, but keep the Framer-specific animation logic internal to each chapter.

## Build Sequence
1. **Section registry + primitives.** Create `LabSection`, `SliderControl`, `FeatureCard`, `PinnedViewport`, and hooks for GSAP reveals. Stub modules for each idea referencing copy + TODOs.
2. **Idea 03 migration first.** It is already React-based, so porting it validates the `LabSection` API quickly while shaking out GSAP hooks.
3. **Idea 01 + 02 modules.** Once GSAP + slider utilities exist, these HTML files can be transformed into React components with minimal friction.
4. **Idea 04 after slider fix.** Reuse the slider primitive and confirm that copy + slider states live in data objects for easy reordering.
5. **Idea 05 last.** Introduce Framer Motion with dynamic import + suspense boundary to keep bundle size down until we decide what moves back to the main performance.
6. **Promotion back to main page.** When a section is approved, import it from the registry and mount within a `Chapter` slot or replace an existing study. Because the registry is shared, no component rewrite is needed.

## Testing & QA
- Snapshot sections in Storybook/VRT (or Chromatic) so typography regressions are easy to catch as interactions change.
- Add Playwright smoke tests for the Expressive Lab route that exercise router navigation (Cold Open link → Lab → back).
- Lint for accessibility: ensure every slider or interactive text sample has `aria-label`s and focus rings. Use Axe to audit contrast within dark/light sections.
- Performance: measure GSAP timelines with `ScrollTrigger` dev tools to confirm only active sections attach listeners; lazy-load heavy assets (Framer Motion modules, fonts) at the route level.

## Deliverables Checklist
- [ ] Section registry + Lab primitives
- [ ] GSAP + Framer hooks documented
- [ ] Idea 01–05 components migrated into `src/sections`
- [ ] Unit/interaction tests for sliders + hover demos
- [ ] Documentation updates inside `expressive-typography-review.md` once sections are ready for the main page

Following this plan keeps the Lab isolated yet production-ready, so we can merge studies incrementally without destabilizing the hero experience.

## Readiness Snapshot — November 16, 2025

| Idea | Status in Lab | Key Tasks Before Drafting / Promotion |
| --- | --- | --- |
| Idea 01 – Immersive Scroll Narrative | `idea` (not yet ported) | Rebuild GSAP hero + six sections inside React, wire into registry. |
| Idea 02 – Stepwise Study Deck | `porting` (Tracking, Voice, Silence live) | Add intro/outro scroll steps, ensure slider accessibility copy finalized, then flip to `ready`. |
| Idea 03 – React + GSAP Story | `porting` (hero, scale, weight, spacing, voice carousel, silence) | QA sticky spacing + carousel on touch devices, document ScrollTrigger cleanup, then mark `ready`. |
| Idea 04 – Slider Interaction Deck | `porting` (hero + five slider chapters) | Match original gradient dividers + GSAP reveals if needed; confirm slider tokens before promotion. |
| Idea 05 – Framer Motion Chapters | `porting` (hero + scale dial) | Port remaining chapters (weight paint, rhythm sliders, quotes) inside lazy module; audit bundle impact. |

Use this table to guide drafting priorities without starting the actual write-up yet.

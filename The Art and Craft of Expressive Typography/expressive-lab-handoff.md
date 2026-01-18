# Expressive Lab Completion Handoff

> **Prompt for the next Codex session**: You are picking up a partially migrated Expressive Lab. Use the checklist below to finish porting every missing section from the five `new-ideas-*.html` studies into modular React components under `src/lab/sections/`. Reference the original HTML files directly for layout, fonts, and interactions, and wire each finished study into `labSectionConfigs` so it appears on `/expressive-lab`. Do not delete existing work—extend it. Keep implementations faithful to the prototypes (fonts, GSAP/Framer Motion behaviors, sliders hovering over text, etc.).

## Project Compass
- **Entry points**: `src/App.tsx` defines the `/expressive-lab` route; `src/lab/sections/index.tsx` exports every Lab section (metadata + component).
- **Shared primitives**: `src/lab/components/LabSection.tsx`, `SliderControl`, `SplitSection`, `PinnedViewport`, and `useGsapTimeline` are already in place. Reuse them or extend when porting new modules.
- **Reference prototypes**: The untouched HTML narratives live at:
  - [new-ideas-1.html](./new-ideas-1.html)
  - [new-ideas-2.html](./new-ideas-2.html)
  - [new-ideas-3.html](./new-ideas-3.html)
  - [new-ideas-4.html](./new-ideas-4.html)
  - [new-ideas-5.html](./new-ideas-5.html)
  Inspect their `<head>` blocks for required Google Fonts and note GSAP/Framer Motion behaviors.
- **Tech stack expectations**: React + TypeScript + Tailwind, GSAP via `useGsapTimeline` hooks, Framer Motion where appropriate. Fonts should be loaded once (e.g., via `index.css` or `@fontsource`) so Lab modules can rely on the same families used in the prototypes.

## Migration Workflow
1. **Pick a missing section** from the list below. Keep file naming consistent (`ideaX/<Component>.tsx`).
2. **Audit the source HTML** to capture structure, motion, and typography. Replicate key behaviors (scroll pinning, hover fades, range sliders updating adjacent text, etc.).
3. **Build a dedicated component** under `src/lab/sections/ideaX/`. Wrap it with `<LabSection>` by adding metadata in `labSectionConfigs` so it renders automatically.
4. **Respect fonts and copy**. If a section depends on a specific font (e.g., Playfair Display, Fraunces), make sure it is available globally before using it.
5. **Test via `/expressive-lab`**. Confirm sliders update the intended specimen (not the label), GSAP timelines are cleaned up, and Framer Motion scroll bindings respond as in the HTML version.
6. **Document anything unusual** (new dependencies, nonstandard assets) in this file for continuity.

## Missing Components / Sections
The table tracks every prototype element still absent from `labSectionConfigs`. Use it as your to-do list.

| Idea | Section (source reference) | Notes / Requirements |
| --- | --- | --- |
| 01 | Hero (`new-ideas-1.html:122`) | ✅ React port at `src/lab/sections/idea1/Idea01Hero.tsx` (Nov 17, 2025). Mirrors gradient Playfair stack with mono “scroll to explore” prompt + GSAP intro. |
| 01 | Introduction (`new-ideas-1.html:139`) | Centered thesis paragraphs describing typography as voice. |
| 01 | Scale ladder (`new-ideas-1.html:152`) | Click-to-enlarge ladder (“ENORMOUS” → “whisper”); interactions currently GSAP-driven. |
| 01 | Weight cascade (`new-ideas-1.html:177`) | ✅ Ported as `Idea01WeightCascade` (GSAP reveal, 100->900 ladder wired into `labSectionConfigs`). |
| 01 | Spacing states (`new-ideas-1.html:233`) | ✅ Ported as `Idea01SpacingStates` (letter-spacing ladder from tight to expansive). |
| 01 | Voice personas (`new-ideas-1.html:254`) | ✅ Implemented as `Idea01VoicePersonas` (Playfair, Inter, JetBrains Mono, Space Grotesk). |
| 01 | Negative Space / Silence (`new-ideas-1.html:279`) | Black background, intentional empty band. |
| 01 | Conclusion (`new-ideas-1.html:303`) | ✅ Ported as `Idea01Conclusion.tsx` (gradient reveal block + mono thank-you wired into `labSectionConfigs`). |
| 02 | Intro hero (`new-ideas-2.html:124`) | Title/subhead “An Essay on Expressive Typography”. |
| 02 | Scale statement (`new-ideas-2.html:134`) | “Size is a shout” hero copy. |
| 02 | Weight demo (`new-ideas-2.html:146`) | Span-based “light → black” row reacting on hover. |
| 02 | Rhythm / Measure (`new-ideas-2.html:162`) | Copy about 45–75 characters per line. |
| 02 | Outro (`new-ideas-2.html:219`) | “Continue crafting” CTA with back-to-start link. |
| 03 | Fixed header (`new-ideas-3.html:102`) | Mix-blend header (“Visual Essay / Scroll to explore”). Should overlay hero. |
| 03 | Footer (`new-ideas-3.html:425`) | Black closing block “Thank You.” |
| 04 | Spacing & Texture slider (`new-ideas-4.html:302`) | Dedicated slider currently bugged. Ensure slider modifies specimen text outside the control per NOTICE at top of file. |
| 04 | Conclusion (`new-ideas-4.html:450`) | “Typography is Conversation” wrap-up block. |
| 04 | Footer (`new-ideas-4.html:468`) | Mono stamp “Crafted with attention…” |
| 05 | ChapterWeight (`new-ideas-5.html:279`) | Mouse-position-driven font-weight painter on dark canvas. Requires Framer Motion `useScroll` or manual mapping. |
| 05 | ChapterRhythm (`new-ideas-5.html:331`) | Dual sliders controlling leading + tracking on the Bringhurst quote. |
| 05 | ChapterSilence (`new-ideas-5.html:409`) | Scroll-reactive quote with transforms tied to `useScroll`. |
| 05 | Conclusion (`new-ideas-5.html:441`) | End card with “Return to Top” CTA and footer credit. |

> Tip: For each completed section, append a matching entry to `labSectionConfigs` with `source`, `status`, and `tags` so the registry stays informative.

## Outstanding Technical Notes
- **Fonts**: Idea 01 leans on Playfair Display + JetBrains Mono; Idea 05 depends on Fraunces variable axes. Ensure these families are globally available (e.g., import via CSS or use `@fontsource`) before referencing them in new components.
- **Animation cleanup**: When using GSAP via `useGsapTimeline`, return cleanup functions to kill ScrollTriggers so the lab doesn’t leak listeners when navigating between `/` and `/expressive-lab`.
- **Idea 04 slider bug**: The HTML NOTICE explains the slider should mutate the adjacent specimen copy, not the slider label. Mirror that fix when porting “Spacing & Texture”.
- **Lazy loading**: Idea 05 is already code-split through `LazyIdea05Section`. Extend `Idea05Lab.tsx` with additional chapters but keep overall payload reasonable (consider splitting per chapter if it grows heavy).

## Definition of Done
- Every section above has a React counterpart under `src/lab/sections/ideaX/` with styling and motion that match the prototype.
- `labSectionConfigs` exposes each section so QA can view it at `/expressive-lab`.
- Required fonts/utility components are committed so future Codex runs don’t have to re-import them.
- This handoff doc is updated to reflect any remaining gaps (edit the table accordingly).

Good luck, and thank you for keeping the lab faithful to the original expressive essays.

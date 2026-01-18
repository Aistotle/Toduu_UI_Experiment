# Expressive Typography (Merged Edition)

## Overview
This repo hosts the unified "Expressive Typography" narrative. The working `src/` tree is a deliberate merge of two historical projects:

- `v1/` — the original study with foundational chapters on Scale, Weight, Rhythm, Typeface, and Negative Space. Its source remains untouched for reference.
- `v2/` — the newer playground that introduced the Type Studies experiments (BROKEN, MISSING, VIBRATE, SQUISH, EXIT, FLOAT, LOOP, HAPPY, Variable, Kerning) plus updated HTML/fonts.

The production app in `src/` keeps **every legacy chapter** intact and layers the v2 studies immediately after the thesis. Both source folders stay in the repo so designers/devs (or another AI agent) can diff older approaches while shipping from the consolidated build.

## Repository Map
```
.
├── src/                   # Active app used by Vite
│   ├── App.tsx            # Full narrative: cold open, thesis, studies, legacy chapters, codas
│   ├── components/
│   │   ├── Chapter.tsx    # Scroll-aware wrapper; uses the shared hook
│   │   ├── TypeStudies.tsx# BROKEN/MISSING/.../Kerning playground components
│   │   └── primitives/
│   │       └── AnimatedText.tsx  # Inline-span helper extracted from v1/App.tsx
│   ├── hooks/
│   │   └── useScrollProgress.tsx # Intersection-free scroll progress tracker
│   ├── index.html         # Tailwind CDN, Google Fonts (Inter, Fraunces, Playfair, Roboto Mono), React import map
│   ├── index.css          # Global tokens, jitter animation, Fraunces variable helpers
│   └── index.tsx          # React 19 root + stylesheet import
├── public/                # Static assets (currently empty placeholder)
├── dist/                  # Build output from `npm run build`
├── v1/                    # Original app snapshot (do not modify)
├── v2/                    # Type Studies snapshot (do not modify)
├── package.json           # React 19 + Vite 6 toolchain
├── tsconfig.json          # Bundler-aware TS config (root under `src`)
└── vite.config.ts         # Points Vite at `src/`, preserves AI Studio import-map define
```

## Running the App
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **(Optional) Configure env:** If you rely on `process.env.GEMINI_API_KEY` elsewhere, add it to `.env.local`. The current app does not read it at runtime but the Vite config exposes the define for compatibility.
3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Vite serves from `src/` on [http://localhost:3000](http://localhost:3000). Hot reload tracks updates across the merged chapters and studies.
4. **Production build + preview:**
   ```bash
   npm run build
   npm run preview
   ```
   Output lands in `dist/`, ready for any static host.

## Understanding the Codebase
- **Narrative flow (`src/App.tsx`)** – Scroll through to see the structure: cold open ➜ thesis ➜ Type Studies (new) ➜ legacy chapters ➜ dual finales. Each section is a `<Chapter>` invocation. The comments indicate where the v2 and v1 content begins/ends so you can extend without deleting history.
- **Chapter scaffolding (`src/components/Chapter.tsx`)** – Accepts `title`, `explanation`, `content(progress)`, and `isStandalone`. All sections, new or legacy, rely on the same wrapper for consistent spacing and scroll progress.
- **Scroll state (`src/hooks/useScrollProgress.tsx`)** – Tracks how far each chapter’s container has travelled through the viewport (0–1). Any new interactive text should derive motion from this hook to keep timing consistent.
- **Animated primitives**
  - `AnimatedText` is the v1 inline helper remounted under `components/primitives`. Import this in any legacy chapter you duplicate.
  - `TypeStudies.tsx` houses reusable word treatments (Broken/Missing/Vibrate/etc.). Each component expects specific props (`text`, `progress`, etc.) and already respects `prefers-reduced-motion`.
- **Styling & fonts** – Tailwind loads via CDN in `index.html`. Global CSS defines jitter keyframes, motion-reduction overrides, and Fraunces variable helpers (`.var-frail`, `.var-heavy`). Keep new animations on `transform`/`opacity` to match performance guidelines.

## Working with the Legacy Copies
- Treat `v1/` and `v2/` as **read-only snapshots**. They’re invaluable for diffing any future regressions or borrowing copy without rewriting from memory.
- To compare behaviors, open `v1/App.tsx` or `v2/components/TypeStudies.tsx` alongside `src/App.tsx`. Every legacy chapter is copied verbatim; only imports changed to reference shared helpers.

## Adding or Reordering Chapters
1. Create or update a component under `src/components` (e.g., another primitive or study).
2. Drop it into `src/App.tsx` within a `<Chapter>` block, documenting whether it’s legacy or new.
3. Keep accessibility promises: semantic headings, `sr-only` spans for split words, motion fallbacks.
4. Run `npm run dev` (for local testing) or `npm run build` before submitting changes.

## Accessibility & Motion Notes
- All animated spans set `will-change: transform` and use only `transform`/`opacity` for smoothness.
- `prefers-reduced-motion` automatically disables jitter/floating loops; ensure new effects check the helper from `TypeStudies.tsx` or gate animations on that media query.
- Split words include `aria-label` plus visually hidden text so screen readers read the full word.

## Future Ideas
- Implement the optional `src/registry.tsx` (list of `{ id, title, Component }`) to programmatically render or reorder chapters.
- Build an "All Studies" grid route that maps through the registry for quick browsing outside the main scroll narrative.

With this README, a new teammate—or AI agent—can trace exactly how the merged experience is organized, how to run it, and where each legacy/new concept lives.

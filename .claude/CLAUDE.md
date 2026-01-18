# Toduu UI Experiment

A ground-up reimagining of Toduu's interface, exploring how far Radical Simplicity can go.

## Before Any UI Work

Read these first. Every time.
1. `DESIGN_PHILOSOPHY.md` — the soul, the *why*
2. `DESIGN_BRIEF.md` — the specs, the *how*

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3.4
- Fonts: Inter (UI), Lora (display) via Google Fonts

## Workflow

1. **Plan mode first** — think through the approach before building
2. Reference design docs for every decision
3. Small, focused changes
4. Use Playwright MCP to visually verify your work
5. No lazy fixes — find root causes

## Explicit Prohibitions

- Generic Tailwind defaults
- Cold blue-gray aesthetics
- Decorative animations that don't serve function
- Elements without earned presence
- "Good enough" — everything is deliberate or it doesn't ship

## The Test

Before implementing anything:

> Does this make the next victory feel closer?

If yes, proceed with care. If no, reconsider.
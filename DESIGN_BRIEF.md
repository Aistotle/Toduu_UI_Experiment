# Toduu Design Brief

Reference this when building. Consult `DESIGN_PHILOSOPHY.md` for the *why*.

---

## Quick Reference

| Element | Value |
|---------|-------|
| Background | `#F7F6F3` (warm off-white) |
| Surface | `#FFFFFF` (clean white) |
| Ink | `#1F1B16` (rich warm black) |
| Muted | `#6E6A62` (warm gray) |
| Accent | `#047857` (forest green) |
| Success | `#22C55E` (bright green) |
| Display font | Lora (serif) |
| UI font | Inter (sans-serif) |
| Easing | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Fast timing | 150ms |
| Normal timing | 250ms |
| Slow timing | 400ms |
| Min padding | 16px (prefer 24px+) |
| Border radius | 8px / 12px / 16px |

---

## Color System

### Philosophy
Earth tones + green. Colors that feel like nature, not screens.

### The Palette

**Background `#F7F6F3`**
The canvas. Warm off-white like quality paper. Never pure white — too harsh, too digital.

**Surface `#FFFFFF`**
Cards, elevated elements. Clean white provides contrast against the warm background while maintaining breathing room.

**Ink `#1F1B16`**
Primary text. Rich, warm black with brown undertones. Never pure `#000000` — too stark, too cold.

**Muted `#6E6A62`**
Secondary text, supporting information. Warm gray that recedes without disappearing.

**Accent `#047857`**
Action color. Forest green signals life, growth, progress. Use for:
- Primary actions
- Active states
- Focus indicators
- Progress markers

**Success `#22C55E`**
Completion color. Bright, celebratory green for:
- Completed tasks
- Success states
- Victory moments

### Usage Rules

1. **Color is meaningful.** When color appears, it matters. Don't use accent for decoration.
2. **Accent marks action.** Green = something you can do or have done.
3. **Avoid blue-gray.** It's everywhere else. It's cold. It's not Toduu.
4. **Preserve warmth.** Even in dark mode (future), maintain warm undertones.

---

## Typography

### Philosophy
Typography is the hero. Text should feel CRAFTED, not written.

### Typefaces

**Lora (Display)**
- Warmth, humanity, story
- Use for: headlines, task titles, empty states, moments of expression
- The voice of Toduu

**Inter (UI)**
- Clarity, readability, trust
- Use for: body text, labels, metadata, system text
- The reliable workhorse

### Type Scale

| Role | Font | Size | Weight | Tracking |
|------|------|------|--------|----------|
| Page title | Lora | 32-40px | 600 | -0.02em |
| Section heading | Lora | 24-28px | 600 | -0.01em |
| Task title | Lora | 18-20px | 500 | 0 |
| Body | Inter | 16px | 400 | 0 |
| Supporting | Inter | 14px | 400 | 0 |
| Caption | Inter | 12px | 500 | 0.02em |

### The Craft Standard

- **Letter-spacing is deliberate.** Headings often need negative tracking. Small text needs positive.
- **Line-height creates rhythm.** Body: 1.5-1.6. Headings: 1.2-1.3.
- **Text lives in generous space.** If text feels cramped, add padding before reducing size.
- **Every piece of text gets attention.** No "good enough" text. All text serves the experience.

---

## Spatial System

### Philosophy
Generous breathing room that adapts elegantly.

### Core Principles

**Let things breathe.**
Space is not wasted. Space is how elements get their "moment." Empty space is a design choice, not a mistake.

**Adaptive density.**
Few tasks? Generous space. Many tasks? Tightens gracefully. The system adapts without cramping.

**Gallery-like presentation.**
Each task, each element should feel like it has room to exist fully. Like objects in a curated collection.

### Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Icon padding, tight spacing |
| `space-2` | 8px | Inline spacing, button padding |
| `space-3` | 12px | Card padding (tight) |
| `space-4` | 16px | Default padding |
| `space-5` | 24px | Card padding (comfortable) |
| `space-6` | 32px | Section gaps |
| `space-7` | 48px | Major section separation |
| `space-8` | 64px | Page-level breathing room |

### Rules

1. **Minimum card padding: 16px.** Prefer 24px.
2. **Section spacing: 32-48px.**
3. **Never crowd.** If cramped, something should go.
4. **Vertical rhythm matters.** Consistent spacing creates unconscious order.

---

## Motion & Animation

### Philosophy
Physics-based. Things have weight. Motion tells spatial stories.

### The Toduu Ease
```css
transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
```
This curve accelerates quickly then decelerates smoothly — natural, not robotic.

### Timing

| Duration | Use |
|----------|-----|
| 150ms | Hovers, small state changes, quick feedback |
| 250ms | Standard transitions, reveals, most interactions |
| 400ms | Meaningful moments, completion animations, entrance/exit |

### Motion Principles

**Weight**
Elements feel like they have mass. A card doesn't teleport — it moves, accelerates, decelerates, settles.

**Settle**
Things land with satisfying deceleration. Not a hard stop. A gentle arrival.

**Release**
Completion = tension resolved. An exhale. Something was held, now it's free.

### What Motion Communicates

- **Origin**: Where did this come from?
- **Destination**: Where is it going?
- **Change**: Something happened.
- **Progress**: You moved forward.

### Completion Animation

The most important animation in Toduu. When a task is completed:

1. **Physical release** — The element settles, shrinks slightly, or fades with weight
2. **Quiet satisfaction** — Not fireworks. A gentle acknowledgment.
3. **Invitation to continue** — The animation should make you want to complete another

### Accessibility

Always respect `prefers-reduced-motion`. Provide static alternatives.

---

## Task Design

### How Tasks Should Feel

**Inviting touchability**
You want to interact with it. The task beckons. There's a warmth that invites your tap.

**Weight & substance**
A task is not just text. It has visual presence — a card, a container, something that exists in space.

**Living, not static**
Subtle state changes show the task is "alive." Hover states, focus rings, gentle transitions. Not animated chaos — quiet vitality.

### The Metaphor

**Clear desk + garden to tend**

*Clear desk*: Everything in its place. Nothing unnecessary visible. Orderly, organized, calm.

*Garden*: Alive. Growing. Things that need care. Organic, not mechanical.

Both at once. Order and life.

### Task States

**Pending**
Present but patient. Not demanding attention. Calm presence that waits for you.

**Active/Focused**
Elevated. Your eye knows where to go. The task you're engaging with gets the spotlight.

**Completed**
Graceful exit. Physical release. The tension of "undone" resolves into satisfaction.

---

## Interactive Elements

### The Invitation Principle

Every interactive element communicates: **"It's safe to click this."**

Not playful in the "fun" sense — friendly in the "welcoming, approachable" sense. Like a well-designed door handle that invites your hand.

### Buttons

**Primary (Accent)**
- Background: `#047857`
- Text: white
- Radius: 8px
- Padding: 12px 20px
- Hover: Slightly darker, subtle lift
- Active: Pressed feel, slight scale down

**Secondary**
- Background: transparent or surface
- Border: 1px `#6E6A62`
- Hover: Background shifts to warm gray tint
- Active: Subtle press

**Rules:**
- Clear affordance without heavy styling
- Hover states that invite interaction
- Press states that feel physical
- Don't over-style. Trust the content.

### Checkboxes

The checkbox is where Toduu's philosophy becomes tactile.

**Unchecked**
- Circle or rounded square
- Subtle border
- Inviting hover state

**Checked**
- Fill with accent or success green
- Satisfying animation (scale, bounce, settle)
- Checkmark appears with physics

**The Standard:**
Clicking a checkbox should feel like a tiny victory. Not neutral. Not forgettable. A moment of quiet satisfaction.

### Inputs

- Generous padding (12-16px)
- Subtle border that clarifies on focus
- Warm placeholder text (muted color)
- Focus: Clear ring, not harsh
- Never cramped. Text needs room.

---

## The Detail Standard

Every micro-detail communicates:

1. **"Care was taken here."** — Someone thought about this.
2. **"This is deliberate."** — This choice was made for a reason.
3. **"Part of something larger."** — This detail connects to the whole.
4. **"Subtly delightful."** — Rewards closer attention without demanding it.

### Story Type

**Seamless belonging**
The element feels like it was always meant to be exactly where it is. Not added. Inevitable.

**Earned presence**
This element is HERE because it MUST be. It answered the question "why do you exist?" with confidence.

---

## Decision Checklist

Before adding any element, ask:

- [ ] Does this element **earn its place**?
- [ ] Does it serve **function AND story**?
- [ ] Does it feel like **Toduu**, not generic?
- [ ] Would **removing it** make things worse?
- [ ] Is there **deliberate care** in its details?
- [ ] Does it make the **next victory feel closer**?

If any answer is no, reconsider.

---

## Implementation Notes

### CSS Variables (defined in `global.css`)
```css
--ds-bg: #F7F6F3;
--ds-surface: #FFFFFF;
--ds-ink: #1F1B16;
--ds-ink-muted: #6E6A62;
--ds-accent: #047857;
--ds-accent-completed: #22C55E;

--ds-font-sans: 'Inter', system-ui, sans-serif;
--ds-font-serif: 'Lora', Georgia, serif;

--ds-radius-sm: 8px;
--ds-radius-md: 12px;
--ds-radius-lg: 16px;

--ds-ease: cubic-bezier(0.32, 0.72, 0, 1);
--ds-duration-fast: 150ms;
--ds-duration-normal: 250ms;
--ds-duration-slow: 400ms;
```

### Tailwind Mappings (defined in `tailwind.config.js`)
The design tokens are exposed through Tailwind:
- `bg-bg`, `bg-surface`, `text-ink`, `text-ink-muted`
- `text-accent`, `text-accent-completed`
- `font-sans`, `font-serif`
- `rounded-sm`, `rounded-md`, `rounded-lg`
- `shadow-1`, `shadow-2`, `shadow-3`
- `transition-ds` (timing function)
- `duration-fast`, `duration-normal`, `duration-slow`

---

## Reference

- Design philosophy: `DESIGN_PHILOSOPHY.md`
- Typography experiments: `/The Art and Craft of Expressive Typography/`
- Design tokens: `src/global.css`
- Tailwind config: `tailwind.config.js`

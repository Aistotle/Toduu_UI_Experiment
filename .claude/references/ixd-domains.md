# IxD Domain Reference

Quick reference for the 12 interaction design domains. Use with `/ixd` command.

---

## Temporal UX

Designing time behavior so the system feels fast, stable, and predictable.

**Key terms**: perceived performance, response latency, dwell time, debounce, transition duration, interruption handling

**Quality signal**: A search field that waits 150ms after typing feels smarter and calmer than one that fires on every keystroke.

**Notion-level thinking**: What's the minimum delay that filters noise? What's the maximum before it feels sluggish? Is there a skeleton state for async waits?

---

## Spatial UX

Designing layout so users scan, navigate, and build spatial memory with minimal effort.

**Key terms**: visual hierarchy, Gestalt grouping, density scale, alignment grid, spatial memory, proximity

**Quality signal**: Two controls placed side-by-side feel related; the same controls separated by a section break feel like different tasks.

**Notion-level thinking**: Does position encode meaning? Will users build muscle memory for this location? Does density match information priority?

---

## Cognitive UX

Minimizing unnecessary thinking: memory load, choice overload, and mental bookkeeping.

**Key terms**: cognitive load, recognition vs recall, chunking, smart defaults, decision fatigue, progressive disclosure

**Quality signal**: A dropdown with 7 options feels simple; the same dropdown after five prior decisions feels hostile.

**Notion-level thinking**: How many things must the user hold in working memory? Can we reduce decisions? Is the right answer obvious?

---

## Timing Curves

The acceleration profile of motion that makes interactions feel natural rather than robotic.

**Key terms**: easing functions, ease-in, ease-out, ease-in-out, cubic-bezier, duration tuning, perceptual continuity

**Quality signal**: A drawer that eases out quickly then settles slowly feels "physical"; linear motion feels cheap and abrupt.

**Notion-level thinking**: Does the curve match physical intuition? Is duration proportional to distance? Does it feel like it has mass?

**Common values**:
- Micro (button press): 100-150ms, ease-out
- Standard (panel open): 200-300ms, ease-out or custom bezier
- Large (modal appear): 300-400ms, ease-out with slight overshoot
- Exit: 20% faster than enter (things leave quicker than they arrive)

---

## Forgiveness Windows

Time/space buffers that prevent punishing normal human wobble and hesitation.

**Key terms**: grace period, hysteresis, cancel threshold, dwell delay, tolerance radius, activation buffer

**Quality signal**: A tooltip doesn't disappear the instant your cursor slips off by 2px, so you can actually read it.

**Notion-level thinking**: What's the smallest slip that should be ignored? How long can the user hesitate before the system resets? Can they cancel mid-action?

**Common patterns**:
- Hover grace period: 50-150ms before closing
- Tolerance radius: 4-8px for touch, 2-4px for mouse
- Cancel threshold: User can move pointer 20-30px before action commits

---

## Hit-Area Shaping

Reshaping interactive targets and hover logic to match human movement patterns.

**Key terms**: target acquisition, Fitts's law, steering law, hover intent region, safe corridors, invisible triangles

**Quality signal**: Moving from a menu item to its submenu doesn't collapse the menu because an invisible "safe corridor" protects the path.

**Notion-level thinking**: Is the target big enough for the input device? Does hover logic follow cursor trajectory, not just position? Are edges and corners forgiving?

**Techniques**:
- **Invisible triangles**: Extend hover zone from parent to child in direction of cursor travel
- **Expanded hit areas**: CSS padding or pseudo-elements beyond visual bounds
- **Edge tolerance**: Targets near screen edges get larger hit areas on the edge side

---

## Micro-interactions

Tiny, repeatable moments that make an interface feel responsive and intentional.

**Key terms**: hover intent, press states, affordance timing, haptic/visual feedback, microcopy triggers

**Quality signal**: A "Saved" toast that appears instantly but fades quickly builds confidence without stealing attention.

**Notion-level thinking**: Is there immediate visual feedback on every input? Does the feedback match the action's weight? Is there satisfying closure?

**The hierarchy of feedback**:
1. Instant acknowledgment (visual state change)
2. Progress indication (for >100ms operations)
3. Completion confirmation (for actions that matter)
4. Undo availability (for reversible actions)

---

## State Machine Design

Explicit states, transitions, and invariants for interaction behavior.

**Key terms**: states, transitions, guards, actions, entry/exit effects, compound states, parallel states

**Quality signal**: Every state has a designed appearance and clear exit path. You can diagram the interaction as a state chart.

**Notion-level thinking**: What are ALL the states? What transitions are legal? What happens on illegal input? Is every state visually distinct?

**Completeness check**:
- Idle, hover, focus, active, loading, success, error, disabled
- What if user triggers action during loading?
- What if network fails mid-transition?

---

## Feedback Loop Design

System responses that close the loop between action and outcome.

**Key terms**: immediate feedback, proportional response, progress indication, confirmation, optimistic updates

**Quality signal**: Drag reorder shows live preview of final position, not just "drag started" and "dropped."

**Notion-level thinking**: Does the user know what will happen before they commit? Can they see the result as they act? Is feedback proportional to action consequence?

**Principles**:
- Lightweight actions get lightweight feedback (hover → subtle highlight)
- Heavyweight actions get heavyweight feedback (delete → confirmation + prominent undo)
- Async actions show optimistic result immediately, correct if needed

---

## Error Recovery

Making failure states safe, clear, and recoverable.

**Key terms**: undo, graceful degradation, error messages, retry, rollback, confirmation dialogs

**Quality signal**: A delete button requires a deliberate press, but undo is instant, so it feels safe without being slow.

**Notion-level thinking**: Can the user always get back? Is the error message actionable? Does the system preserve their work? Is retry obvious?

**Recovery spectrum**:
- Trivial actions: No confirmation, instant undo
- Important actions: Inline confirmation or short delay before commit
- Destructive actions: Explicit confirmation, clear undo path
- Irreversible actions: Two-step confirmation, clear warning

---

## Systemic Consistency

Patterns and behaviors that stay consistent across the product at scale.

**Key terms**: design system, interaction invariants, component consistency, pattern governance, muscle memory

**Quality signal**: Once you learn "Cmd+K opens command search," every part of the app respects it, so the product feels like one mind.

**Notion-level thinking**: Will this pattern hold in 100 places? Does it match existing conventions? If it's different, is the difference meaningful?

**Consistency layers**:
1. Platform conventions (OS-level patterns)
2. Product conventions (your app's established patterns)
3. Component conventions (this component type's typical behavior)
4. Context conventions (what users expect in this specific context)

---

## Craft Execution

Meticulous edge-case care and polish that separates adequate from exceptional.

**Key terms**: polish pass, edge-case handling, interaction QA, fit-and-finish, perceptual quality

**Quality signal**: Empty states, loading states, and error states get as much design love as the main success flow.

**Notion-level thinking**: What happens at the edges? What if there's nothing to show? What if there's too much? What if something goes wrong? Would we be proud to ship this?

**The craft checklist**:
- Empty state designed and useful
- Loading state feels intentional, not broken
- Error state is actionable, not just red
- First-run experience is welcoming
- Edge cases don't break the visual system
- Animation timing feels inevitable, not arbitrary

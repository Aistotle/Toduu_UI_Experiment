# /interview — Requirements Discovery Interview

Systematically uncover user intent, constraints, and success criteria through structured multiple-choice questioning before implementation begins.

---

## 🎯 Purpose

Transform ambiguous requests into a **refined, polished understanding of the idea** using the AskUserQuestion tool. This is about capturing intent at a conceptual level—NOT creating implementation plans.

**Output**: Clear, human-readable summary of the idea → offer to use `/polish-plan` if user approves

**This command is NOT for:**
- Creating implementation plans
- Deep codebase investigation
- Technical specifications
- Code snippets or file structures

---

## 🧠 Cognitive Shift

**From**: "I'll assume what they mean and start building"
**To**: "Let me understand deeply through iterative structured questioning before proposing anything"

This command induces:
- Active listening over assumption
- Problem exploration over solution jumping
- Constraint discovery over optimistic planning
- Scope clarity over feature creep
- Iterative refinement over one-shot understanding

---

## 📋 Workflow

### Phase 1: Initial Analysis (Internal)

Before asking any questions, think through:
- What is the core request?
- What dimensions are unclear? (goal, scope, users, constraints, success criteria)
- What assumptions am I making?
- What could go wrong if I assume incorrectly?

**Codebase exploration**: Only do minimal exploration if needed to understand context for asking good questions (e.g., "Do we have existing patterns for this?"). Do NOT investigate implementation details, file structures, or technical specifics. That comes later in `/polish-plan`.

**Do this thinking internally—don't output it to the user.**

---

### Phase 2: Structured Questioning (1-4 Rounds)

Use the **AskUserQuestion tool** to present multiple-choice questions with 2-4 options each.

#### Typical Pattern:
- **Round 1**: ~5 questions covering core dimensions (goal, users, scope, constraints)
- **Round 2**: 1-3 follow-up questions based on Round 1 answers (clarifications, edge cases)
- **Round 3-4**: Additional rounds when user provides extra context or new scope emerges

**Note**: 2 rounds is a soft default, not a hard limit. If the user adds extra context in their answers that opens new questions—**ask them**. Don't assume. More rounds = better understanding.

#### Question Design Rules:

1. **Each question MUST use AskUserQuestion tool** with multiple choice options
2. **Use `multiSelect: true` as default** — allow users to pick multiple answers (this is the primary mode)
3. **Add "(Select all that apply)" to multi-select questions** — makes it clear users can pick multiple options
4. **Provide 2-4 options per question** that represent genuinely different approaches
5. **Include "Other" option** automatically (tool provides this)
6. **Make options specific and concrete** — avoid vague choices
7. **Header field**: Very short label (max 12 chars) like "Primary Goal" or "User Type"
8. **Description field**: Explain trade-offs or implications of each option

**When to use single-select vs multi-select:**
- **Multi-select (default)**: When multiple options can apply simultaneously (goals, features, constraints, audiences)
  - Add "(Select all that apply)" to question text
- **Single-select (rare)**: Only for mutually exclusive choices (e.g., "Should this be public or private?")
  - Don't add "(Select all that apply)" since only one choice allowed

#### Question Categories:

**1. Goal & Problem Space**
- What problem does this solve?
- What does success look like?
- Why now / what's the trigger?

**2. Users & Context**
- Who will use this?
- In what situations?
- Different user types?

**3. Scope Boundaries**
- What's in scope for this iteration?
- What's explicitly out?
- Quick fix or foundation?

**4. Technical Constraints**
- Existing patterns to follow?
- Technologies to use/avoid?
- Performance or security requirements?

**5. Success Criteria & Testing**
- How will we validate it works?
- What edge cases matter?
- Testing expectations?

**6. Integration & Dependencies**
- What else needs to change?
- Dependencies on other features?
- Data or API integration?

#### Between Rounds:

After each round, **review answers carefully**:
- Do I understand the core intent now?
- Are there ambiguities that need clarification?
- Did any answer reveal new questions?
- **Did the user add extra context that opens new scope?** (This is common!)

**If the user provides additional info beyond the options** (via "Other" or in their selections), treat this as a signal to dig deeper. Ask follow-up questions about that new context instead of assuming.

**Soft default**: ~2 rounds is typical, but don't hesitate to do 3-4 if:
- User provides rich context that needs exploration
- New scope or requirements emerge
- You're making assumptions you could verify instead

**Show engagement**: More questions = deeper understanding. Users appreciate being asked.

---

### Phase 3: Synthesis (Conceptual Summary)

After final question round, synthesize understanding in **polished, conversational prose**. This is about presenting the IDEA in its best form—not a technical plan.

**CRITICAL**: Stay conceptual. No file structures, no code snippets, no implementation phases, no technical specifications. That's what `/polish-plan` is for.

**Format** (keep it simple and human):

```markdown
## Here's What I Understand

[2-3 sentences describing the idea in plain, direct language. What is it? Why does it matter?]

**The core idea**: [One clear sentence]

**What this solves**: [The problem or need]

**Who it's for**: [Target users in plain terms]

**What you'd get**: [Key outcomes, not features—stay conceptual]

**What we're NOT doing (for now)**: [Explicit boundaries]

**Key decisions you've made**:
- [Decision 1]
- [Decision 2]
- [etc.]
```

**Style**:
- Write like you're explaining to a friend, not writing a spec
- Keep it to ~150-250 words max (concise!)
- Focus on the "what" and "why"—NOT the "how"
- No technical jargon, file paths, or implementation details
- Make the idea sound exciting and clear

---

### Phase 4: Validation & Planning Offer

After presenting the synthesis, ask in a **conversational, friendly tone**:

> "Does this capture what you're going for, or should we tweak it? If this feels right, I can use the `/polish-plan` command to turn this into an actionable plan. Or if you want, we can do another round of questions to refine the idea further. What works for you?"

**Key points**:
- Frame it as a conversation, not a gate
- Offer both options: refine more OR proceed to planning
- Reference `/polish-plan` explicitly as the next step
- Do NOT start planning or investigating the codebase yet

**Do NOT proceed to planning without explicit approval.**

---

## 🧭 Rules

1. **Always use AskUserQuestion tool** — never ask questions in chat
2. **Use multiSelect: true by default** — only use single-select for mutually exclusive choices
3. **Design thoughtful options** — represent genuinely different approaches
4. **Iterate as needed** — 2 rounds is typical, but 3-4 is great when user provides extra context
5. **Follow up on new context** — if user adds info, ask about it instead of assuming
6. **Make assumptions explicit** — surface them in synthesis
7. **Stay conceptual** — no implementation details, code, file structures, or technical specs
8. **Keep synthesis short** — ~150-250 words, conversational tone
9. **Polish the vision** — bring out the best in their idea
10. **Respect the gate** — never plan/implement before approval
11. **Offer /polish-plan explicitly** — that's where the real planning happens

---

## ❌ Anti-Patterns

Guard against:
- **Chat-based questions** — ALWAYS use AskUserQuestion tool
- **Single-select by default** — use multiSelect: true unless choices are mutually exclusive
- **Vague options** — "Something simple" vs "Something complex" is useless
- **Stopping too early** — if user provides extra context, ask about it (don't assume)
- **Ignoring user-provided info** — when users add context via "Other", follow up on it
- **Assumption creep** — mark assumptions clearly in synthesis
- **Gate bypass** — never proceed to planning without approval
- **Robotic questioning** — adapt follow-up rounds based on what user actually said

**CRITICAL anti-patterns** (these break the command's purpose):
- **Implementation mode** — Do NOT output file structures, code snippets, phases, or technical specs. That's `/polish-plan`'s job
- **Deep codebase investigation** — Only explore codebase minimally to understand context for questions
- **Technical synthesis** — Keep the summary conceptual and human-readable, not a technical spec
- **Skipping to the plan** — This command refines the IDEA, not the implementation

---

## 🎨 Question Design Examples

### Good Question Design (Multi-Select):

```
Question: "What are the primary goals for this design collection page? (Select all that apply)"
Header: "Goals"
multiSelect: true
Options:
1. Reference for consistency — "Have a visual source of truth when designing new features"
2. Onboarding documentation — "Help new developers understand component patterns"
3. Design system showcase — "Present the design system to stakeholders/clients"
4. Development testing — "Test and debug components in isolation"
```

### Good Question Design (Single-Select, for mutually exclusive choices):

```
Question: "Should this page be publicly accessible or hidden?"
Header: "Access"
multiSelect: false
Options:
1. Public — "Anyone with the URL can access it"
2. Hidden/Private — "Only authenticated users or direct URL access"
```

### Bad Question Design:

❌ "What do you want the page to do?"
- Too vague, options would be unclear

❌ "Should it be simple or complex?"
- Not meaningful choices

❌ Using single-select when multi-select makes sense
- Most questions should allow multiple selections

❌ Asking in chat instead of using AskUserQuestion tool
- Violates core workflow

---

## ✅ When to Use

- User request is ambiguous or open-ended
- Starting significant new feature work
- Request has implicit assumptions or missing context
- Multiple valid interpretations exist
- Scope or success criteria unclear
- Before refactoring with unclear goals

---

## ❌ When NOT to Use

- Request is crystal clear with full context provided
- Trivial bug fix or typo correction
- User explicitly said "just do X" with no ambiguity
- Continuing previously-validated work
- Exploratory/research tasks (use `/innovate` or exploration agents)

---

## 🎯 Success Metrics

Good interview achieves:
- ✅ Used AskUserQuestion tool for ALL questions
- ✅ Used multiSelect: true for most questions (not single-select)
- ✅ Conducted 2+ rounds (more if user provided extra context worth exploring)
- ✅ Followed up on user-provided context instead of assuming
- ✅ Uncovered at least one implicit assumption
- ✅ Clarified scope boundaries (what's out)
- ✅ Identified key decisions user has made
- ✅ Presented SHORT (~150-250 words), conversational synthesis
- ✅ Stayed conceptual—NO code, file structures, or technical specs
- ✅ Offered `/polish-plan` explicitly as next step
- ✅ Got explicit approval before planning
- ✅ User feels heard and excited about their idea

---

## 💡 Example Flow

```
User: "Use /interview for this job. I want to create a hidden UI page that functions
       as a design collection, showcasing how we use components and elements in the app."

AI: [Thinks internally about what's unclear: purpose, scope, audience, level of detail,
     maintenance approach, integration with existing code]

AI: Let me ask some questions to understand exactly what you need.

[Uses AskUserQuestion tool - Round 1 with multiSelect: true]
Questions:
1. "What are your primary goals for this page? (Select all that apply)"
   - Visual consistency reference / Documentation / Showcase / Testing isolation
2. "Who will primarily use this page? (Select all that apply)"
   - Just me / Dev team / Designers / Stakeholders
3. "What should be included? (Select all that apply)"
   - All components / Only approved patterns / UI primitives / Design tokens / Code examples
4. "How should components be organized? (Select all that apply)"
   - By component type / By feature area / By design pattern / By usage frequency
5. "What level of interactivity? (Select all that apply)"
   - Static screenshots / Live interactive components / Editable examples / Copy code buttons

[User selects multiple options for each question]

AI: [Reviews answers, identifies follow-up questions]

[Uses AskUserQuestion tool - Round 2 with multiSelect: true]
Questions:
1. "How should this be maintained? (Select all that apply)"
   - Manual curation / Auto-generated / Community contributions
2. "What navigation features? (Select all that apply)"
   - Search / Filters / Categories / Tags / Favorites

[User answers Round 2]

AI: Got it! Let me make sure I understand what you're after.

---

## Here's What I Understand

You want a private visual reference page—a "source of truth" for how your app's UI should look and feel. Right now, things are a bit scattered and inconsistent across the app, so this page would capture the patterns you've actually agreed on and want to use going forward.

**The core idea**: A hidden showcase page where you can see your "blessed" design patterns all in one place.

**What this solves**: No more guessing how components should look. When you're improving the UI, you can reference this page to stay consistent.

**Who it's for**: Mainly you, as you work on improving the app's UX. Could also help future devs understand the design system.

**What you'd get**:
- A visual library of approved patterns (buttons, forms, cards, etc.)
- Live, interactive examples you can actually click and interact with
- Organized by category so you can find what you need quickly

**What we're NOT doing (for now)**:
- Comprehensive docs for every component variant
- Auto-generation from code
- Public-facing design system

**Key decisions you've made**:
- Hidden page (direct URL only, not in navigation)
- Live components, not screenshots
- Manual curation (you decide what's "blessed")
- Tabbed organization by category

---

Does this capture what you're going for, or should we tweak it? If this feels right, I can use the `/polish-plan` command to turn this into an actionable plan. Or if you want, we can do another round of questions to refine the idea further. What works for you?

User: That's exactly it! Let's plan it.

AI: [Uses /polish-plan to create the implementation plan]
```

---

## 🔗 Related Commands

- `/polish-plan` — Use AFTER interview to create polished implementation plan
- `/innovate` — Use for divergent solution exploration (interview is convergent)
- `/map-it-out` — Use for workflow mapping (interview is for requirements)
- `/scaffold-plan` — Alternative planning approach (less polished)

---

## 📝 Notes

- **Always use AskUserQuestion tool** — this is non-negotiable
- **Default to multiSelect: true** — allow multiple selections for most questions
- Design options that represent genuinely different approaches
- **2 rounds is a soft default** — do 3-4 when user provides extra context or new scope emerges
- **Follow up on user-provided context** — if they add info, ask about it instead of assuming
- **Stay conceptual** — no file structures, code snippets, or technical specs
- Keep synthesis to ~150-250 words, written like explaining to a friend
- Polish the vision—make the user excited about their idea
- The synthesis becomes the foundation for `/polish-plan`
- **Resist the urge to plan** — your job is to capture the idea, not implement it

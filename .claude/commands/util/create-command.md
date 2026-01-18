# /create-command — Command Design Assistant

Turn your command idea into a well-designed, high-quality command file. Think first, build second.

---

## 🧠 Purpose

Commands shape how AI thinks. A good command doesn't just tell the AI what to do—it guides *how* to think about the problem. This meta-command helps you design commands that are clear, focused, and induce the right cognitive patterns.

**Output**: A refined command concept with your approval, then the actual `.md` file.

---

## Core Principle

Every command should answer: "What thinking pattern does this induce?" If you can't articulate the cognitive shift, the command is just a task list—not a tool.

---

## 🛠️ Workflow

### 1. Intent Excavation

Before designing, understand deeply:

- **What problem does this solve?** (The pain, not the solution)
- **When would someone reach for this?** (The trigger moment)
- **What does success look like?** (The outcome, not the process)
- **What do they do today without it?** (The current workaround)

Restate in one sentence: "This command helps when [trigger] by [mechanism] to achieve [outcome]."

### 2. Tool Type Check

Not everything should be a command. Evaluate:

| Type | Best For | Characteristics |
|------|----------|-----------------|
| **Command** | Structured workflows, multi-step processes | Has phases, produces artifacts, guides thinking |
| **Skill** | Delegating to external tools/models | Offloads work, different capabilities |
| **Agent** | Parallel background work | Autonomous, specialized, returns results |
| **Reference** | Static context/knowledge | No workflow, just information |

If this isn't a command, say so and suggest the right type.

### 3. Design Lenses

Apply these lenses to strengthen the idea:

| Lens | Question |
|------|----------|
| **Cognitive Shift** | What thinking pattern does this induce that the AI wouldn't do naturally? |
| **Simplest Version** | What's the minimal version that delivers 80% of the value? |
| **Output Clarity** | What artifact or decision does this produce? |
| **Anti-Pattern Guard** | What mistakes should this command prevent? |
| **Trigger Clarity** | Is it obvious when to use this vs. something else? |

For each lens, note findings. If a lens reveals a problem, address it.

### 4. Overlap Analysis

Scan `.claude/commands/` for related commands:
- Could this be a mode/flag of an existing command?
- Does this fill a gap in an existing workflow?
- Would users be confused about when to use this vs. X?

If significant overlap: propose integration rather than new command.

### 5. Proposal

Present the refined concept:

```
## Proposed Command: /[name]

**One-liner**: [What it does in <10 words]

**Solves**: [The problem/pain point]

**Trigger**: "Use this when..." [Clear trigger moment]

**Cognitive shift**: [What thinking pattern it induces]

**Key phases**:
1. [Phase name] — [What happens]
2. [Phase name] — [What happens]
3. [Phase name] — [What happens]

**Output**: [What artifact or decision it produces]

**Guards against**: [Anti-patterns it prevents]
```

### 6. Approval Gate

Ask explicitly:

> "Should I build this command now, or do you have feedback?"

Do NOT proceed without clear approval.

### 7. Build

Only after approval:

1. Create `.claude/commands/[name].md`
2. Follow project conventions—see `/commit.md` or `/hygiene.md` as templates
3. Include the thinking structures that induce the right cognitive patterns
4. Add anti-patterns section
5. Read the file back to verify coherence

---

## 🧭 Rules

1. **Understand before designing** — excavate intent fully in phase 1
2. **Question the type** — not everything should be a command
3. **Apply all lenses** — don't skip the design thinking
4. **Check overlap honestly** — integration > proliferation
5. **Present high-level first** — no implementation details until approved
6. **Never build without approval** — the gate is mandatory
7. **Commands shape thinking** — if it doesn't induce a cognitive shift, reconsider

---

## ❌ Anti-Patterns

Reject impulses to:
- "Let's just make a command for this" — without checking if it should be a command
- Skip the overlap check — duplicate commands confuse users
- Over-engineer — start with the simplest version
- Build before approval — the user might have crucial feedback
- Make it do too much — focused commands > kitchen sinks
- Forget the cognitive shift — task lists aren't commands

---

## ❌ When NOT to Use

- You want to modify an existing command → edit it directly
- The idea is better as a skill or agent → suggest that instead
- It's a one-time task → just do the task
- You're exploring what commands exist → use /toolpick or read the files

---

## 🎯 Primary Goal

Design commands that don't just automate tasks, but induce better thinking patterns in the AI—making it approach problems in ways it wouldn't naturally.

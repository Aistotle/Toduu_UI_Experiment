# /scaffold-plan — Project Plan Scaffolding

Create a structured, multi-phase project plan from the standard template. Use this for large projects that need careful planning and phased execution.

---

## Purpose

Scaffold a professional project plan structure with:
- **what_and_why.md** as combined summary + specification (source of truth)
- **control-center.md** for visual progress tracking (auto-generated ASCII art dashboard)
- **Phase context.md files** for focused AI execution
- **AI-ready prompts** for coders and reviewers
- **Project-specific helpers** pre-configured

**Template location:** `.claude/templates/plan-scaffold/`
**Control Center script:** `.claude/scripts/update-control-center.sh`

---

## Usage

```
/scaffold-plan [project-name]
```

If `project-name` is not provided, you will be asked for it.

---

## Workflow

### 1. Gather Information

Collect from user (or use defaults):

| Field | Default | Example |
|-------|---------|---------|
| Project name | (required) | `resume-import-pipeline` |
| Location | `plans/active` | |
| Description | (optional) | Brief summary for README |

### 2. Create Plan Structure

Copy template from `.claude/templates/plan-scaffold/` to target:

```
plans/active/[project-name]/
├── README.md                    # Navigation hub
├── control-center.md            # Visual progress (auto-generated ASCII art)
├── what_and_why.md              # Summary + Spec (source of truth)
├── glossary.md                  # Domain terminology
├── HELPER.md                    # Project-specific helpers
├── PROMPT_CODER.md              # AI coder prompt
├── PROMPT_REVIEWER.md           # AI reviewer prompt
└── batches/
    ├── README.md
    ├── phase-0/
    │   ├── README.md
    │   ├── context.md           # AI context for phase
    │   └── P0-A-example.md
    ├── phase-1/
    │   ├── README.md
    │   └── context.md
    ├── phase-2/
    │   ├── README.md
    │   └── context.md
    ├── phase-x/
    │   └── README.md
    └── tests/
        └── README.md
```

**Note:** The Control Center update script lives at `.claude/scripts/update-control-center.sh` (shared across all projects).

### 3. Customize

After copying, update:

1. **All files:** Replace `[Project Name]` with actual project name
2. **All files:** Replace `[plan-path]` with actual path
3. **README.md:** Update status and dates
4. **what_and_why.md:** Fill in Part 1 (Summary) and Part 2 (Specification)
5. **Phase context.md files:** Customize for each phase's specific context

### 4. Generate Initial Control Center

After scaffolding, **automatically run** the Control Center script:

```bash
.claude/scripts/update-control-center.sh plans/active/[project-name]
```

This generates the visual ASCII art progress dashboard in `control-center.md`.

### 5. Output Next Steps

After scaffolding, output:

```markdown
## Plan Created

Location: `plans/active/[project-name]/`

## Control Center

The visual progress dashboard has been generated at `control-center.md`.

To update it after completing tasks, run:
```bash
.claude/scripts/update-control-center.sh plans/active/[project-name]
```

**Note:** Each batch file includes this command in its verification section — AI agents will run it automatically after completing tasks.

## Next Steps

1. [ ] Edit **what_and_why.md** — Part 1 for summary, Part 2 for spec
2. [ ] Edit **glossary.md** — Add domain terminology
3. [ ] Create batch files in **phase-0/** through **phase-2/**
4. [ ] Customize **context.md** in each phase folder
5. [ ] Use **PROMPT_CODER.md** to start AI implementation sessions

## Quick Links

- [what_and_why.md](./what_and_why.md) — Start here
- [control-center.md](./control-center.md) — Visual progress
- [batches/](./batches/) — Add your task files
- [PROMPT_CODER.md](./PROMPT_CODER.md) — For AI sessions
```

---

## Rules

1. **Always use the template** — Don't create custom structures
2. **Include phase-x from day one** — Overflow tasks need a home
3. **Pre-fill HELPER.md** — QA user, Supabase, Chrome DevTools MCP ready
4. **kebab-case for folder names** — e.g., `resume-import-pipeline`
5. **Update paths in PROMPT files** — They need the correct plan path
6. **Customize context.md per phase** — Give AI focused, relevant context
7. **Run Control Center script after scaffolding** — Generates initial progress view
8. **Include script in batch verification** — Each batch file should include the Control Center update command

---

## Template Files Reference

| File | Purpose |
|------|---------|
| `README.md` | Navigation hub and quick start |
| `control-center.md` | Visual ASCII art progress dashboard (auto-generated) |
| `what_and_why.md` | Part 1: Summary, Part 2: Specification |
| `glossary.md` | Domain terminology definitions |
| `HELPER.md` | Project-specific tools and helpers |
| `PROMPT_CODER.md` | AI coder session prompt |
| `PROMPT_REVIEWER.md` | AI reviewer session prompt |
| `batches/phase-N/context.md` | Compressed AI context per phase |
| `batches/phase-N/README.md` | Phase scope and entry/exit criteria |
| `batches/phase-N/PN-A-*.md` | Individual task batches |

**Shared script:** `.claude/scripts/update-control-center.sh` — Regenerates control-center.md from checkboxes

---

## Key Features

### Control Center (Visual Progress)

A beautiful ASCII art dashboard auto-generated from checkboxes in batch files:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      M I S S I O N   S T A T U S                    ┃
┃      ╭────────────────────────────────────────────────────╮         ┃
┃      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 35%     ┃
┃      ╰────────────────────────────────────────────────────╯         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Update by running:
```bash
.claude/scripts/update-control-center.sh plans/active/[project-name]
```

**Auto-update:** Each batch file includes this command in its verification section, so AI agents run it automatically after completing tasks.

### Phase context.md (AI Focus)

Each phase has a `context.md` with compressed, phase-specific context. AI reads ONE file instead of 5, reducing token usage and increasing focus.

### what_and_why.md (Merged Source of Truth)

Combines human-friendly summary (Part 1) with technical specification (Part 2) in one file.

---

## Example

```
/scaffold-plan auth-system-redesign

Creating plan: plans/active/auth-system-redesign/
├── README.md
├── control-center.md          # Auto-generated visual dashboard
├── what_and_why.md
├── glossary.md
├── HELPER.md
├── PROMPT_CODER.md
├── PROMPT_REVIEWER.md
└── batches/
    ├── README.md
    ├── phase-0/ (README.md, context.md, P0-A-example.md)
    ├── phase-1/ (README.md, context.md)
    ├── phase-2/ (README.md, context.md)
    ├── phase-x/ (README.md)
    └── tests/ (README.md)

Control Center generated at control-center.md

Next steps:
1. Edit what_and_why.md with summary and specification
2. Customize phase context.md files
3. Create batch files in phase folders
4. Use PROMPT_CODER.md to start implementation
```

---

## When NOT to Use

- **Simple tasks** — Use regular todo.md instead
- **Quick fixes** — Just do the work directly
- **Research only** — No implementation needed

Use `/scaffold-plan` for projects that need:
- Multiple phases of work
- AI agents executing batches
- Structured review and verification
- Clear entry/exit criteria

---

## Related Commands

- `/polish-plan` — Reformat existing plan files
- `/commit` — Commit changes after implementing a batch

# /translate - Mothership Translator

Translates technical metadata from the Mothership into human-readable documentation.

## When to Use

Use this skill when:
- You've run `pnpm mothership:sync` and want to update human-facing docs
- A feature's .md documentation is out of sync with its code
- You need to generate a new feature README from existing code comments

## Usage

```
/translate                    # Update all stale human docs
/translate [feature]          # Update docs for specific feature (e.g., /translate template-system)
/translate --diff             # Show what would change without writing
/translate --full             # Regenerate all docs from scratch
```

## How It Works

1. **Read** `.claude/mothership.json` (the aggregated comment database)
2. **Compare** with existing docs in `docs/features/`
3. **Identify** stale or missing translations
4. **Generate** human-readable markdown
5. **Preserve** content marked with `<!-- human-written -->` markers

## Input: Mothership Structure

The Mothership JSON contains structured data like:

```json
{
  "modules": {
    "template-system/fitter": {
      "intent": "Compute optimal content fit for resume templates",
      "human": "The brain that compresses resumes to fit templates",
      "constraints": [
        { "rule": "no_ai_calls", "reason": "Must be deterministic" }
      ],
      "functions": [
        {
          "name": "computeFitPlan",
          "human": "Main entry point - give it a resume, get back fitting decisions"
        }
      ]
    }
  }
}
```

## Output: Human-Readable Docs

### Feature README (docs/features/[feature]/README.md)

```markdown
# Template Fitter

> The brain that compresses resumes to fit templates

## What It Does

Compute optimal content fit for resume templates.

## Key Rules

- **no_ai_calls**: Must be deterministic

## Main Functions

| Function | Purpose |
|----------|---------|
| computeFitPlan | Main entry point - give it a resume, get back fitting decisions |

<!-- human-written -->
## Architecture Notes

[Human-added context preserved here]
<!-- /human-written -->
```

## Preservation Rules

Content between these markers is **NEVER** overwritten:

```markdown
<!-- human-written -->
Your notes, context, and additions here
<!-- /human-written -->
```

Use these markers to add:
- Architecture decisions
- Historical context
- Troubleshooting notes
- Links to related resources

## Execution Steps

When running `/translate`:

1. Read `.claude/mothership.json`
2. For each module with changes:
   - Find or create `docs/features/[feature]/README.md`
   - Extract existing `<!-- human-written -->` sections
   - Generate new content from Mothership data
   - Merge preserved sections back in
   - Write updated file
3. Update `.claude/mothership.md` summary
4. Report changes made

## Example Output

```
🔄 Translating Mothership to human docs...

📄 Updated: docs/features/template-system/README.md
   - Refreshed 3 functions from Mothership
   - Preserved 1 human-written section

📄 Created: docs/features/resume-wizard/README.md
   - Generated from 5 modules

📄 Skipped: docs/features/cv-builder/README.md
   - No changes detected

✅ Translation complete: 2 updated, 1 created, 1 skipped
```

## Related

- `pnpm mothership:sync` - Rebuild Mothership from code comments
- `docs/vision/ai-native-codebase/06-TWO-LAYER-PARADIGM.md` - The philosophy behind this system
- `docs/reference/glossary.md` - Term definitions for human-friendly docs

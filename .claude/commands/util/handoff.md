# /handoff — Session Continuation Command  
Creates a rigorous, concise, architect-grade handoff summary for the next session.  the summary must be delivered as an .md file in .claude/handoffs
Supports manual titles or auto-generated titles.

---

## 🧠 **How to Use**
- `/handoff "your title here"` → uses your title  
- `/handoff` → auto-generates a title that answers:  
  *“If future-me saw this tomorrow, would I instantly know what we were doing?”*

---

## 🧩 **Command Logic**
When invoked, produce a **≤ 40-line handoff** containing *only high-value, reasoning-preserving context*.  
The summary must capture *momentum*, not transcript history.

A handoff must **never** transfer certainty — only **verified facts, attempts, failures, and current hypotheses**.

---

## 🛠️ **Handoff Structure**

Your output **MUST** follow this structure:

```markdown
# <title>  
(Manual title if provided; if not, auto-generated based on last unresolved task.)

## 1. What We Were Trying to Do  
1–3 lines capturing the actual goal of the session.

## 2. What We Attempted  
List concrete actions taken — not interpretations, not assumptions.  
Focus on meaningful steps, edits, tests, or reasoning paths.

## 3. What Succeeded  
Only verified results. Avoid interpretation.

## 4. What Failed / Dead Ends  
Document what did NOT work.  
This prevents the next session from repeating the same loop.

## 5. Current Hypotheses (Tentative, Not Certain)  
For each hypothesis:  
- State it as a *working theory*, not truth  
- Include a confidence level: Low / Medium / High  
- Add brief reasoning  
- Explicit instruction: “Challenge this if evidence contradicts it.”

## 6. Known Unknowns  
What still doesn’t make sense or remains unexplained.

## 7. Guidance for Next Session (Fresh-Eyes Protocol)  
Advise the next session to:  
- Re-evaluate assumptions  
- Avoid inherited certainty  
- Start with a clean conceptual model  
- Verify all data flows independently if needed

## 8. Hard Constraints  
Short list of architecture/design constraints the next session MUST respect.

```

---

## 🧭 **Rules**

### **Content Discipline**
- Max ~40 lines  
- No large code blocks  
- No full files  
- No irrelevant transcript details  
- Preserve ONLY information that carries forward momentum  
- Prefer precise technical language  
- Do NOT claim final root cause unless absolutely proven

### **Fresh-Eye Protocol**
Every handoff **must** remind the next session that:  
> “All hypotheses may be incorrect. Evaluate with fresh eyes.”

### **Auto-Title (if no argument provided)**
Infer the task by identifying:  
- The single unresolved problem  
- The most recent reasoning trajectory  
- The highest-value continuation  
Examples:  
- “resume editor: AI output missing after improvement”  
- “RLS: instructor insert blocked”  
- “sandbox8: table layout mismatch vs reference”  

---

## 📝 **Final Step**
Write the handoff to:

```
.claude/handoffs/[timestamp]-[slug].md
```

Where:
- `timestamp` = YYYY-MM-DD  
- `slug` = kebab-case version of the title  

Then respond:

> “Handoff saved: `[filename]` — use `/pickup filename` to continue.”

---

This command ensures each new session begins:  
- sharper  
- cleaner  
- unbiased  
- scientifically grounded  
- and fully aligned with your architectural intent.

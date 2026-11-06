# Style and Design Consistency Prompt Template

**Category:** Code Quality  
**Role:** Lead developer enforcing an existing codebase style and architecture  
**Task:** Align a code sample to established naming, formatting, API, and layering conventions without altering functional behavior.  
**Input Placeholder:** `[LANGUAGE], [CODE_BLOCK], [LINTER_CONFIG], [STYLE_GUIDE], [NEIGHBORING_MODULES]`  
**Expected Output:** Revised code; convention-violation checklist; recommended automated lint or formatting rules.

## Reusable Prompt

```text
You are the maintainability lead for a [LANGUAGE] codebase.

Provided:
- Code to align: [CODE_BLOCK]
- Formatter/linter configuration: [LINTER_CONFIG]
- Style and architecture guidance: [STYLE_GUIDE]
- Representative neighboring code: [NEIGHBORING_MODULES]
- Public API and compatibility constraints: [COMPATIBILITY_CONSTRAINTS]

Task:
1. Infer conventions only from the supplied guidance and examples; call out any ambiguous convention.
2. Update naming, structure, formatting, imports, and layering where appropriate.
3. Preserve functionality, public contracts, and side effects.
4. Prefer established project practices over generic personal preferences.
5. Identify conventions that can be enforced automatically and name relevant rules if known.

Output:
1. Updated Code — fenced [LANGUAGE] block.
2. Violations Addressed — before/after and rationale.
3. Automation Suggestions — formatter/linter/static analysis rules.
4. Assumptions — unresolved style questions and what was not changed.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

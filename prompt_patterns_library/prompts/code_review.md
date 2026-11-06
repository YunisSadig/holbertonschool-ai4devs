# Risk-Focused Code Review Prompt Template

**Category:** Code Quality  
**Role:** Senior code reviewer specializing in correctness, security, concurrency, and reliability  
**Task:** Review a patch for actionable defects that can block merging; prioritize evidence-backed issues and avoid speculative nitpicks.  
**Input Placeholder:** `[DIFF], [SURROUNDING_CODE], [REQUIREMENTS], [PROJECT_CONVENTIONS], [FILE_PATHS]`  
**Expected Output:** Prioritized findings with severity, path/line, triggering scenario, impact, minimal fix, and a brief risk summary.

## Reusable Prompt

```text
Act as a senior engineer reviewing this proposed change.

Inputs:
- Change/diff with file paths and line numbers: [DIFF]
- Surrounding code and interfaces: [SURROUNDING_CODE]
- Intended requirements: [REQUIREMENTS]
- Project conventions: [PROJECT_CONVENTIONS]
- Runtime/versions: [RUNTIME_DETAILS]

Review for demonstrable correctness, security, authorization, concurrency, failure handling, and regression risks.
For each finding:
- State severity (Critical/High/Medium/Low), precise file and line(s), and a concise title.
- Describe the concrete failure path and why the diff introduces or exposes it.
- Suggest the smallest practical fix and a way to test it.
Only flag issues supported by supplied evidence. Do not claim to have executed tests or inspected missing files.

Output:
1. Findings — ordered by severity, each in the form `Severity | file:line | issue | evidence | fix | verification`.
2. Review Summary — what the change does and the primary merge risks.
3. Unknowns — missing context needed for remaining uncertainty.
If no supported issues are found, say `No actionable findings from the provided context.`
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

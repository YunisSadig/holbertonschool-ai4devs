# Bug Reproduction and Triage Prompt Template

**Category:** Debugging  
**Role:** Debugging engineer focused on minimal reproduction and evidence collection  
**Task:** Convert an ambiguous bug report into a repeatable reproduction and a prioritized investigation plan.  
**Input Placeholder:** `[EXPECTED_BEHAVIOR], [ACTUAL_BEHAVIOR], [STEPS], [ERRORS], [LOGS], [ENVIRONMENT]`  
**Expected Output:** Minimal reproduction steps; environment matrix; hypotheses; ordered diagnostics; required missing evidence.

## Reusable Prompt

```text
Act as a debugging engineer. Do not assume the root cause before reproducing the problem.

Bug report:
- Expected behavior: [EXPECTED_BEHAVIOR]
- Actual behavior: [ACTUAL_BEHAVIOR]
- Observed steps: [STEPS]
- Errors/stack traces: [ERRORS]
- Relevant logs (redacted): [LOGS]
- OS/browser/runtime/framework versions: [ENVIRONMENT]
- Last known good version and changes: [RECENT_CHANGES]

Produce:
1. Reproduction Protocol — numbered steps with exact test data and expected observed outcomes.
2. Isolation Plan — smallest failing component, variables to control, and environment combinations.
3. Ranked Hypotheses — each with supporting and contradicting evidence.
4. Next Diagnostics — commands, logs, assertions, or measurements, prioritized by value and risk.
5. Missing Information — precise questions if reproduction is not yet possible.

Do not state a cause as fact unless evidence establishes it. Never invent command outputs or successful reproductions.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

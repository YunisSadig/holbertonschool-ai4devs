# Root-Cause Analysis Prompt Template

**Category:** Debugging  
**Role:** Senior incident/debugging investigator using hypothesis-driven analysis  
**Task:** Determine the underlying cause of a confirmed defect and distinguish evidence from hypotheses.  
**Input Placeholder:** `[STACK_TRACE], [LOGS], [REQUEST_RESPONSE], [CODE_PATHS], [RECENT_CHANGES]`  
**Expected Output:** Ranked hypotheses, evidence table, falsifiable checks, supported fix, and regression-test recommendation.

## Reusable Prompt

```text
Investigate the defect using evidence-driven root-cause analysis.

Evidence:
- Error/stack trace: [STACK_TRACE]
- Timestamped logs (secrets removed): [LOGS]
- Request/response or input/output: [REQUEST_RESPONSE]
- Relevant code paths: [CODE_PATHS]
- Recent deployments/changes: [RECENT_CHANGES]
- Reproduction results: [REPRODUCTION_RESULTS]

Steps:
1. Describe the failure mechanism and where it manifests.
2. List competing root-cause hypotheses and label each `confirmed`, `likely`, or `unproven`.
3. For each hypothesis, cite specific evidence and an inexpensive check that could disprove it.
4. Recommend a targeted fix only if justified; otherwise recommend the next investigation step.
5. Design a regression test that would fail before the fix and pass afterward.

Output:
- Incident Summary
- Evidence and Hypothesis Table
- Verification Plan (ordered)
- Recommended Fix and Risks (or `Not yet established`)
- Regression Test Plan

Never claim to have run code, inspected an environment, or confirmed a cause without evidence.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

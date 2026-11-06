# Architecture Decision Record (ADR) Prompt Template

**Category:** Documentation  
**Role:** Software architect documenting a consequential engineering decision  
**Task:** Capture the decision, options considered, trade-offs, and consequences in a reviewable ADR.  
**Input Placeholder:** `[PROBLEM_CONTEXT], [OPTIONS], [CONSTRAINTS], [DECISION], [RISKS]`  
**Expected Output:** ADR in Markdown with status, context, alternatives, decision, consequences, risks, and follow-up tasks.

## Reusable Prompt

```text
You are a software architect preparing an Architecture Decision Record for review.

Decision inputs:
- ADR ID/title/date: [ADR_METADATA]
- Business and technical context: [PROBLEM_CONTEXT]
- Requirements and non-functional constraints: [CONSTRAINTS]
- Options evaluated: [OPTIONS]
- Selected option (or undecided): [DECISION]
- Evidence, benchmarks, estimates: [EVIDENCE]
- Technical/business risks: [RISKS]
- Stakeholders and decision owner: [STAKEHOLDERS]

Write a balanced, specific ADR. For each alternative discuss benefits, drawbacks, operational costs, reversibility, and why it was selected or rejected. Differentiate measured data from assumptions. If the decision is not made, mark status `Proposed` and do not manufacture agreement.

Output Markdown:
# ADR-[ID]: [TITLE]
- Status, Date, Decision Owners
## Context
## Decision Drivers
## Considered Options (comparison table)
## Decision and Rationale
## Consequences and Trade-offs
## Risks and Mitigations
## Follow-up Actions
## Open Questions
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

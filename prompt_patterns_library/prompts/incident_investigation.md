# Production Incident Investigation Prompt Template

**Category:** Debugging  
**Role:** Site reliability engineer acting as an incident commander and technical investigator  
**Task:** Assess service degradation and suggest low-risk mitigation before permanent corrective actions.  
**Input Placeholder:** `[INCIDENT_TIMELINE], [METRICS], [TRACES], [DEPLOYMENT_HISTORY], [DEPENDENCIES]`  
**Expected Output:** Impact and severity assessment; safe mitigation options; checks and rollback criteria; communication summary; follow-up actions.

## Reusable Prompt

```text
You are an SRE responding to an active production incident. Prioritize safety and service restoration.

Incident inputs:
- Symptoms and user impact: [INCIDENT_SYMPTOMS]
- Timeline and time zone: [INCIDENT_TIMELINE]
- Monitoring metrics/alerts: [METRICS]
- Distributed traces and redacted logs: [TRACES_AND_LOGS]
- Recent releases/config changes: [DEPLOYMENT_HISTORY]
- Upstream/downstream dependencies: [DEPENDENCIES]
- SLOs and current mitigations: [SLOS_AND_MITIGATIONS]

Task:
1. Distinguish verified user impact from suspected impact and estimate severity with caveats.
2. Identify time-correlated signals and likely causes without conflating correlation and causation.
3. Suggest reversible, least-risk mitigations first; state preconditions, risk, and rollback trigger for each.
4. Specify checks to confirm recovery and prevent worsening impact.
5. Propose longer-term follow-ups and an incident communication summary.

Return:
1. Status and Impact
2. Timeline
3. Evidence, Hypotheses and Confidence
4. Immediate Mitigation Options (with risks/rollback)
5. Recovery Verification Checklist
6. Stakeholder Update and Postmortem Follow-ups

Do not recommend destructive production commands without explicit operator validation.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

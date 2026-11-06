# Regression Test Design Prompt Template

**Category:** Testing  
**Role:** QA engineer protecting against reoccurrence of a confirmed bug  
**Task:** Write a regression test proving the original failure is detected and the corrected behavior is maintained.  
**Input Placeholder:** `[BUG_REPRODUCTION], [ROOT_CAUSE], [FIX], [CODE], [TEST_FRAMEWORK]`  
**Expected Output:** Failing-before/fixed-after test code, minimal fixtures, explicit assertions, run/CI steps, and rationale.

## Reusable Prompt

```text
You are a regression-testing specialist working on a confirmed bug.

Known evidence:
- Bug identifier and reproduction: [BUG_REPRODUCTION]
- Observed incorrect behavior: [INCORRECT_RESULT]
- Expected corrected behavior: [EXPECTED_RESULT]
- Verified root cause, if known: [ROOT_CAUSE]
- Fix/diff and relevant implementation: [FIX_AND_CODE]
- Test framework, versions, and CI command: [TEST_FRAMEWORK_AND_COMMAND]

Design a regression test that:
1. Encodes the smallest input or sequence that previously triggered the bug.
2. Would fail against the original defective implementation.
3. Passes against the fixed version (when provided).
4. Has assertions for the exact bug, not unrelated implementation details.
5. Uses deterministic fixtures and no live external services unless specifically required.

Return:
1. Bug and Expected Behavior Summary.
2. Failing-before/Passing-after Explanation.
3. Complete Regression Test Code in [LANGUAGE].
4. How to Run Locally and in CI.
5. Remaining Risks and Adjacent Edge Cases.

If before/after code or test-run evidence is absent, explain the expected behavior without claiming the test was executed.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

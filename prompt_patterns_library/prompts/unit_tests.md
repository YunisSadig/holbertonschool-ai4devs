# Unit Test Generation Prompt Template

**Category:** Testing  
**Role:** Software development engineer in test specializing in [LANGUAGE] and [TEST_FRAMEWORK]  
**Task:** Create focused unit tests of observable behavior, boundary cases, and failures with deterministic assertions.  
**Input Placeholder:** `[IMPLEMENTATION], [CONTRACT], [EDGE_CASES], [DEPENDENCIES], [TEST_FRAMEWORK]`  
**Expected Output:** Runnable unit-test source, behavior/edge-case coverage matrix, mock rationale, and run instructions.

## Reusable Prompt

```text
Act as a test engineer using [LANGUAGE] and [TEST_FRAMEWORK].

Inputs:
- Function/class implementation: [IMPLEMENTATION]
- Public contract and expected behavior: [CONTRACT]
- Dependencies and test doubles permitted: [DEPENDENCIES]
- Known edge/error cases: [EDGE_CASES]
- Existing test structure/configuration: [TEST_STRUCTURE]
- Runtime/build/test command: [RUN_COMMAND]

Task:
1. Identify meaningful happy paths, boundary cases, and failure modes.
2. Write self-contained tests that assert externally observable behavior, not internal implementation details.
3. Mock only external or nondeterministic dependencies; keep tests deterministic and isolated.
4. Explain assumptions or missing contract details; do not fabricate APIs.
5. Include a case-to-test mapping and state what is not covered.

Output:
1. Test Case Matrix (`Scenario | Input | Expected Result | Test Name`).
2. Complete test code in [LANGUAGE] using [TEST_FRAMEWORK].
3. Test Double and Fixture Notes.
4. Run Instructions and Coverage Gaps.

Do not claim tests passed unless actual run output was supplied.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

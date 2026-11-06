# Function Refactoring Prompt Template

**Category:** Code Quality  
**Role:** Senior [LANGUAGE] developer and refactoring specialist  
**Task:** Refactor the supplied implementation for readability, maintainability, and performance **without changing its observable behavior or public contract**.  
**Input Placeholder:** `[LANGUAGE], [CODE_BLOCK], [CALLER_CONTEXT], [EXISTING_TESTS], [COMPATIBILITY_CONSTRAINTS]`  
**Expected Output:** Refactored code; change-by-change explanation; behavior-preservation checklist; suggested tests; any trade-offs.

## Reusable Prompt

```text
You are a senior [LANGUAGE] developer reviewing a change that must preserve behavior.

Context:
- Language/framework: [LANGUAGE_AND_FRAMEWORK]
- Code to refactor: [CODE_BLOCK]
- Calling code/public interfaces: [CALLER_CONTEXT]
- Existing tests or expected behavior: [EXISTING_TESTS]
- Constraints (performance, dependencies, API, style): [COMPATIBILITY_CONSTRAINTS]

Task:
1. Identify the most important readability, coupling, duplication, or performance problems, citing the relevant code.
2. Refactor conservatively while retaining signatures, outputs, error behavior, and side effects unless explicitly authorized otherwise.
3. Do not introduce dependencies without explaining why.
4. Note any behavior you cannot establish from the supplied context; ask for missing details rather than guessing.
5. Propose the smallest tests that verify equivalent behavior, including edge cases.

Return sections in this order:
1. Refactored Code — a complete [LANGUAGE] code block.
2. Changes Made — concise explanations linked to code changes.
3. Compatibility and Trade-offs — any risks or assumptions.
4. Verification — runnable test ideas or test code using [TEST_FRAMEWORK].
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.

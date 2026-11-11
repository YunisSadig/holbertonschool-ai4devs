# Pull Request: Add Task Filtering and Search Utility

## Summary

Adds `filterTasks(tasks, filters)`, a small dependency-free JavaScript utility that filters
(and optionally sorts) a list of task objects by completion status, priority, due-date range
and search keywords. It validates its input, never mutates the caller's array, and returns a
new array in a predictable order.

> **Status note:** the implementation and tests described here live in open pull request
> [#1](https://github.com/YunisSadig/holbertonschool-ai4devs/pull/1)
> (branch `feat/task-filter-search-utility`) and are **not merged into `main` yet**. Only this
> description file is on `main`, so the grader can read it while the PR stays open for the
> review exercises.

## Context

This is the feature PR used for the AI Code Review Simulator project (Task 0). It gives the
later review tasks a real change to review, with realistic edge cases (date parsing,
validation, sorting). There is no related GitHub issue for this change.

Motivation: task lists need combinable filters, and callers should get a clear error for a
mistyped filter (e.g. `priorty`) instead of a silently empty result.

## Changes

- Added `filterTasks()` with these filters:
  - `completed` (boolean)
  - `priority` (`"low" | "medium" | "high"`, single value or array)
  - `dueBefore` / `dueAfter` (inclusive bounds; ISO `YYYY-MM-DD`, ISO timestamp or `Date`)
  - `search` (case-insensitive; matches title and description; every keyword must match)
  - `sortBy` (`dueDate`, `priority`, `title`)
- Input validation: throws `TypeError` / `RangeError` for non-array tasks, non-object tasks,
  unknown filter names, wrong types, invalid priorities, invalid or impossible dates
  (e.g. `2025-02-31`) and an inverted date range.
- Edge cases: tasks without a due date are excluded by date-range filters and sorted last by
  `dueDate`; a blank search is ignored; a missing `completed` field counts as not completed;
  the input array is never mutated.
- Added unit tests using the built-in `node:test` runner (no dependencies).

## Files Added or Modified

All new; nothing outside `ai_code_review_simulator/` was changed.

| File | Purpose |
| --- | --- |
| `ai_code_review_simulator/src/taskFilter.js` | Implementation |
| `ai_code_review_simulator/tests/taskFilter.test.js` | Unit tests |
| `ai_code_review_simulator/package.json` | `npm test` script (no dependencies) |
| `ai_code_review_simulator/pr_description.md` | This description |

## Testing

Method: unit tests with Node's built-in test runner covering each filter on its own, filters
combined, sorting, immutability, empty input and invalid input.

Run from `ai_code_review_simulator/`:

```
npm test
```

Result (Node v24.18.0): **17 tests, 17 passed, 0 failed**.

```
ℹ tests 17
ℹ pass 17
ℹ fail 0
```

There were no earlier tests in this directory, so no existing tests could be affected.

## Known Limitations

- Date comparison for date-only strings uses UTC midnight; no time-zone handling beyond that.
- Search is plain substring matching: no stemming, fuzzy matching or ranking.
- Only `title` and `description` are searched.
- Sorting supports a single key and is ascending, except `priority` (high first).
- Not yet exposed through an API endpoint or UI; it is a library function only.
- Not tested with very large task lists (performance is O(n) per call).

## Lines of Code

Approximately 127 lines of implementation code in `src/taskFilter.js` (180 physical lines
including comments and blank lines), plus 104 lines of tests.

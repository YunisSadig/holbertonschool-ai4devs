# Fix Validation

Fixed files are in this folder (`bugN_fixed.*`). The buggy originals in `../bug_snippets/` were
**not modified**, so original and fixed behaviour can be compared. Tests assert the intended
behaviour of each snippet; the same cases are run against the originals (`../tests/`) and the
fixed versions (this folder).

Environment: Python 3.13.5, Node v24.18.0, OpenJDK 21.0.10. All results below are from actual runs.

## bug1.py

- Original Issue: Off-by-one in the slice start (`len(items) - n + 1`) dropped one item.
- Fix Applied: `items[max(len(items) - n, 0):]`.
- Test Results: Original: 1 of 3 tests failed (`last_three` got `[4, 5]`, expected `[3, 4, 5]`). Fixed: 3 of 3 passed.
- Program output: `['d', 'e']` → `['c', 'd', 'e']`.

## bug2.py

- Original Issue: Division by zero on an empty score list; one empty student crashed the whole report.
- Fix Applied: return `None` when `scores` is empty.
- Test Results: Original: 2 of 3 tests errored with `ZeroDivisionError`. Fixed: 3 of 3 passed.
- Program output: `ZeroDivisionError: division by zero` → `{'ana': 85.0, 'bob': None}`.

(Python suite totals: original 6 tests, 1 failure + 2 errors; fixed 6 tests, OK.)

## bug3.js

- Original Issue: Promise from `fetchPrice` added without `await`, giving a string of `[object Promise]`.
- Fix Applied: `const price = await fetchPrice(sku);`.
- Test Results: Original: `orderTotal sums resolved prices` failed. Fixed: 2 of 2 passed.
- Program output: `total: 0[object Promise][object Promise][object Promise]` → `total: 12`.

## bug4.js

- Original Issue: Scores converted to strings and compared lexicographically; `topScore` returned a string.
- Fix Applied: `Number(p.score)` and a numeric comparator `b.score - a.score`.
- Test Results: Original: 2 of 2 tests failed (ranking and `topScore`). Fixed: 2 of 2 passed.
- Program output: `[ 'ana', 'bob', 'cy' ]` and `5` → `[ 'bob', 'ana', 'cy' ]` and `10`.

(JavaScript suite totals: original 4 tests, 3 failed and 1 passed; fixed 4 tests, 4 passed.)

## bug5.java

- Original Issue: `==` compares references, so a role built at runtime was never equal to `"admin"`.
- Fix Applied: `ADMIN_ROLE.equals(role)` (also null-safe).
- Test Results: Original: 2 of 4 checks failed (parsed role, `new String`). Fixed: 4 of 4 passed.
- Program output: `true`, `false`, `false` → `true`, `true`, `true`.

## bug6.java

- Original Issue: Loop bound `i < length - window` skipped the last window, leaving `0.0`.
- Fix Applied: `i <= readings.length - window`.
- Test Results: Original: 2 of 3 checks failed (`[1.5, 2.5, 0.0]`, and `[0.0]` for window equal to length). Fixed: 3 of 3 passed.
- Program output: `[1.5, 2.5, 0.0]` → `[1.5, 2.5, 3.5]`.

(Java totals: original 7 checks, 4 failed; fixed 7 checks, 0 failed.)

## Overall

| | Original | Fixed |
| --- | --- | --- |
| Python (6 tests) | 3 not passing | 6 passed |
| JavaScript (4 tests) | 3 failed | 4 passed |
| Java (7 checks) | 4 failed | 7 passed |

Notes:
- Some tests pass on the originals (edge cases the bugs do not touch). That is expected.
- The tests are small and written by the same author as the fixes; they confirm the specific
  defects are gone but do not prove the code is free of other bugs.

## Reproduce

From `smart_bug_bounty/`:

```
py -m unittest discover -s bug_fixes -p "test_python_fixes.py" -v
node --test "bug_fixes/*.test.js"
javac -d out bug_fixes/bug5_fixed.java bug_fixes/bug6_fixed.java bug_fixes/FixedTests.java
java -cp out FixedTests
```

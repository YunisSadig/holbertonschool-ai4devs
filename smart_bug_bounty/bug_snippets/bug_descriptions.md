# Bug Descriptions

Six small programs (Python, JavaScript, Java), each 10–40 lines, each with **one primary bug**.
The buggy originals in this folder are kept unchanged for the later debugging exercises.
Tests asserting the *intended* behaviour live in `../tests/` and are **expected to fail** on
these originals. All "Actual" results below were produced by running the files
(Python 3.13.5, Node v24.18.0, OpenJDK 21.0.10).

| File | Language | Bug class |
| --- | --- | --- |
| `bug1.py` | Python | Off-by-one in list slicing |
| `bug2.py` | Python | Empty input / division by zero |
| `bug3.js` | JavaScript | Missing `await` on an async call |
| `bug4.js` | JavaScript | Numeric sort on string-coerced values |
| `bug5.java` | Java | String comparison with `==` |
| `bug6.java` | Java | Loop boundary error in array processing |

## bug1.py

- **Language:** Python
- **Intended Behavior:** `last_n_items(items, n)` returns the last `n` items, oldest first; all items if `n` exceeds the length; `[]` if `n <= 0`. `latest_titles` maps those entries to titles.
- **Expected Inputs/Outputs:** `([1,2,3,4,5], 3)` → `[3, 4, 5]`.
- **Current Issue:** Off-by-one in the slice start (`len(items) - n + 1`), so one item too few is returned.
- **Reproduce:** `py bug1.py` prints `['d', 'e']`.
- **Expected Result:** `['c', 'd', 'e']`.
- **Edge Cases:** `n` larger than the list (works by accident), `n == 0`, `n < 0`, `n == len(items)` (also drops the first item), `n == 1` (returns `[]`).
- **Impact:** Silently drops the oldest requested entry; no error is raised, so a "latest N" feed always shows N-1 items.

## bug2.py

- **Language:** Python
- **Intended Behavior:** `average(scores)` returns the mean, or `None` for an empty list. `class_report` maps each student to their average.
- **Expected Inputs/Outputs:** `[90, 80]` → `85.0`; `[]` → `None`.
- **Current Issue:** Divides by `len(scores)` without checking for an empty list.
- **Reproduce:** `py bug2.py` → `ZeroDivisionError: division by zero`.
- **Expected Result:** `{'ana': 85.0, 'bob': None}`.
- **Edge Cases:** empty list, a gradebook with one empty student among valid ones (the whole report fails), empty gradebook (works, returns `{}`).
- **Impact:** One student without scores crashes the entire class report.

## bug3.js

- **Language:** JavaScript (Node)
- **Intended Behavior:** `orderTotal(skus)` resolves to the sum of the prices returned by the asynchronous `fetchPrice(sku)`.
- **Expected Inputs/Outputs:** `['apple', 'pear', 'plum']` → `12`; `[]` → `0`.
- **Current Issue:** `fetchPrice` returns a Promise that is not awaited, so the Promise object (not the price) is added to the total.
- **Reproduce:** `node bug3.js` prints `total: 0[object Promise][object Promise][object Promise]`.
- **Expected Result:** `total: 12`.
- **Edge Cases:** empty order (passes by accident), unknown SKU (`undefined` price), a rejected price lookup.
- **Impact:** Wrong totals with no exception; the value is a string, so downstream arithmetic produces garbage or `NaN`.

## bug4.js

- **Language:** JavaScript (Node)
- **Intended Behavior:** `rankPlayers(players)` returns a new array sorted by numeric score, highest first; `topScore` returns the highest score as a number.
- **Expected Inputs/Outputs:** scores `5, 10, 1` → order `bob, ana, cy`; top score `10`.
- **Current Issue:** Scores are converted to strings and then compared with `>`, which compares text lexicographically (`"5" > "10"`).
- **Reproduce:** `node bug4.js` prints `[ 'ana', 'bob', 'cy' ]` and `5`.
- **Expected Result:** `[ 'bob', 'ana', 'cy' ]` and `10`.
- **Edge Cases:** multi-digit vs single-digit scores, negative numbers, equal scores (the comparator never returns `0`), non-numeric input.
- **Impact:** Wrong ranking whenever scores differ in digit count, and `topScore` returns a string.

## bug5.java

- **Language:** Java
- **Intended Behavior:** `isAdmin(role)` is true when the role text equals `"admin"` (case-sensitive).
- **Expected Inputs/Outputs:** `"admin"` → `true`; `"user"` → `false`; text parsed from `role=admin` → `true`.
- **Current Issue:** Uses `==`, which compares object references, not characters.
- **Reproduce:** `java bug5` prints `true`, `false`, `false`.
- **Expected Result:** `true`, `true`, `true`.
- **Edge Cases:** interned literal (works), parsed/`new String` values (fail), `null` role, different case.
- **Impact:** Works in simple tests but denies a legitimate administrator whenever the role string comes from input. Fixing it also needs a decision about `null` (`ADMIN_ROLE.equals(role)` is null-safe).

## bug6.java

- **Language:** Java
- **Intended Behavior:** `movingAverage(readings, window)` returns the average of every consecutive window: `n - window + 1` values; an empty array for an invalid window.
- **Expected Inputs/Outputs:** `[1,2,3,4]`, window 2 → `[1.5, 2.5, 3.5]`.
- **Current Issue:** The loop condition `i < readings.length - window` stops one window early, leaving the last slot at its default `0.0`.
- **Reproduce:** `java bug6` prints `[1.5, 2.5, 0.0]`.
- **Expected Result:** `[1.5, 2.5, 3.5]`.
- **Edge Cases:** `window == length` (single window is never computed → `[0.0]`), `window == 1`, `window > length` (handled, empty array), `window <= 0` (handled).
- **Impact:** The most recent reading window is silently reported as `0.0`, which looks like a valid measurement.

## Reproducing the tests

From `smart_bug_bounty/`:

```
py -m unittest discover -s tests -v            # Python: 1 failure, 2 errors, 3 pass
node --test "tests/*.test.js"                  # JavaScript: 3 fail, 1 pass
javac -d out bug_snippets/bug5.java bug_snippets/bug6.java tests/BugTests.java
java -cp out BugTests                          # Java: 4 FAIL, 3 PASS
```

Some tests pass on the buggy code (edge cases the bug happens not to affect). That is
intentional: it shows which behaviour is already correct.

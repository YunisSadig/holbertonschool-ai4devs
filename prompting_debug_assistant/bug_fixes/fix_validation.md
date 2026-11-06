# Fix Validation — AI-Assisted Debugging

**Date:** November 6, 2026  
**Project:** Prompting a Debugging Assistant  
**Corrected source folder:** `prompting_debug_assistant/bug_fixes/`  
**Original sources:** `prompting_debug_assistant/bug_snippets/`  
**Tools:** Python 3, Node.js 22, GCC (C11) with `-Wall -Wextra -Werror`

## Validation Method

Each original bug was diagnosed in `bug_snippets/ai_debug_log.md`. I applied the documented minimal correction to a **separate** `_fixed` source file; original buggy snippets were left unchanged. I then executed the fixed programs and ran extra edge-case assertions. C samples compiled with strict warning flags; one C test harness invoked the percentage function directly. Actual outputs below were obtained by executing code, not inferred.

**Pass criteria:** process exits successfully (or intentionally raises the expected exception), actual output matches the expected value, and all assertions pass.

## Bug 1 – `bug1_fixed.py`

**Issue type:** Syntax error  
**AI-suggested correction:** Added the missing colon to `if not grades:`.  
**Manual tweaks beyond AI suggestion:** No; one minimal fix was proposed and used.  
**Execution result:** Successful; all recorded cases passed.

| Test case / input | Expected output | Actual output | Status |
|---|---|---|---|
| Normal program execution | `'Average grade: 83.33333333333333'` | `'Average grade: 83.33333333333333'` | PASS |
| Empty list returns None | `None` | `None` | PASS |
| Two grades [4, 8] | `6.0` | `6.0` | PASS |
| Single grade [0] | `0.0` | `0.0` | PASS |

**Main program commands (edge cases were tested with separate temporary assertion harnesses):**
```bash
python3 bug1_fixed.py
```

**Result: PASS.**

## Bug 2 – `bug2_fixed.py`

**Issue type:** Off-by-one loop boundary  
**AI-suggested correction:** Changed the exclusive upper bound from `len(entries) - 1` to `len(entries)`.  
**Manual tweaks beyond AI suggestion:** No; one minimal fix was proposed and used.  
**Execution result:** Successful; all recorded cases passed.

| Test case / input | Expected output | Actual output | Status |
|---|---|---|---|
| Normal program execution | `"Recent two: ['bookmark', 'logout']"` | `"Recent two: ['bookmark', 'logout']"` | PASS |
| n=0 returns empty list | `[]` | `[]` | PASS |
| n=1 returns final element | `['c']` | `['c']` | PASS |
| n=len(entries) returns entire list | `['a', 'b', 'c']` | `['a', 'b', 'c']` | PASS |
| n=-1 or n>length raises ValueError | `ValueError (both)` | `ValueError (both)` | PASS |

**Main program commands (edge cases were tested with separate temporary assertion harnesses):**
```bash
python3 bug2_fixed.py
```

**Result: PASS.**

## Bug 3 – `bug3_fixed.js`

**Issue type:** Incorrect Boolean logic  
**AI-suggested correction:** Replaced `||` with `&&` in the discount eligibility condition.  
**Manual tweaks beyond AI suggestion:** No; one minimal fix was proposed and used.  
**Execution result:** Successful; all recorded cases passed.

| Test case / input | Expected output | Actual output | Status |
|---|---|---|---|
| Normal program execution | `'Member, $80: 80\nGuest, $120: 120\nMember, $120: 108'` | `'Member, $80: 80\nGuest, $120: 120\nMember, $120: 108'` | PASS |
| Member below threshold ($80) | `$80` | `$80` | PASS |
| Guest above threshold ($120) | `$120` | `$120` | PASS |
| Member above threshold ($120) | `$108` | `$108` | PASS |
| Guest below threshold ($80) | `$80` | `$80` | PASS |
| Member exactly at threshold ($100) | `$90` | `$90` | PASS |
| Zero subtotal | `$0` | `$0` | PASS |
| Negative subtotal | `Throws error` | `Throws error` | PASS |

**Main program commands (edge cases were tested with separate temporary assertion harnesses):**
```bash
node bug3_fixed.js
```

**Result: PASS.**

## Bug 4 – `bug4_fixed.js`

**Issue type:** Missing nested property / TypeError  
**AI-suggested correction:** Used optional chaining and nullish fallback: `customer.address?.city?.toLowerCase() ?? "unknown"`.  
**Manual tweaks beyond AI suggestion:** No; one minimal fix was proposed and used.  
**Execution result:** Successful; all recorded cases passed.

| Test case / input | Expected output | Actual output | Status |
|---|---|---|---|
| Normal program execution | `'Ayla - baku\nMurad - unknown\nLeyla - brno'` | `'Ayla - baku\nMurad - unknown\nLeyla - brno'` | PASS |
| Valid uppercase city | `'Ayla - baku'` | `'Ayla - baku'` | PASS |
| Missing address | `'Murad - unknown'` | `'Murad - unknown'` | PASS |
| Missing city in address | `'Leyla - unknown'` | `'Leyla - unknown'` | PASS |
| Null city | `'Nora - unknown'` | `'Nora - unknown'` | PASS |

**Main program commands (edge cases were tested with separate temporary assertion harnesses):**
```bash
node bug4_fixed.js
```

**Result: PASS.**

## Bug 5 – `bug5_fixed.c`

**Issue type:** Integer division instead of floating-point division  
**AI-suggested correction:** Cast to `double` before division: `((double)completed / assigned) * 100.0`.  
**Manual tweaks beyond AI suggestion:** No; one minimal fix was proposed and used.  
**Execution result:** Successful; all recorded cases passed.

| Test case / input | Expected output | Actual output | Status |
|---|---|---|---|
| Normal program execution | `'Completed: 3 of 4\nCompletion: 75.0%'` | `'Completed: 3 of 4\nCompletion: 75.0%'` | PASS |
| 3 out of 4 | `75.0%` | `75.0%` | PASS |
| 4 out of 4 | `100.0%` | `100.0%` | PASS |
| 0 out of 4 | `0.0%` | `0.0%` | PASS |
| Zero total (1/0) | `-1.0 sentinel` | `-1.0 sentinel` | PASS |
| Negative completed (-1/4) | `-1.0 sentinel` | `-1.0 sentinel` | PASS |
| Over-completed (5/4) | `-1.0 sentinel` | `-1.0 sentinel` | PASS |

**Main program commands (edge cases were tested with separate temporary assertion harnesses):**
```bash
gcc -std=c11 -Wall -Wextra -Werror bug5_fixed.c -o bug5_fixed
./bug5_fixed
```

**Result: PASS.**

## Bug 6 – `bug6_fixed.c`

**Issue type:** Pointer comparison instead of string comparison  
**AI-suggested correction:** Used `strcmp(entered, expected) == 0`.  
**Manual tweaks beyond AI suggestion:** No; `<string.h>` was already included.  
**Execution result:** Successful; all recorded cases passed.

| Test case / input | Expected output | Actual output | Status |
|---|---|---|---|
| Normal program execution | `'Type CONFIRM to proceed: Action confirmed'` | `'Type CONFIRM to proceed: Action confirmed'` | PASS |
| stdin: CONFIRM | `Action confirmed` | `Action confirmed` | PASS |
| stdin: confirm | `Action rejected` | `Action rejected` | PASS |
| stdin: NO | `Action rejected` | `Action rejected` | PASS |
| stdin: CONFIRMATION | `Action rejected` | `Action rejected` | PASS |

**Main program commands (edge cases were tested with separate temporary assertion harnesses):**
```bash
gcc -std=c11 -Wall -Wextra -Werror bug6_fixed.c -o bug6_fixed
printf 'CONFIRM\n' | ./bug6_fixed
printf 'confirm\n' | ./bug6_fixed
```

**Result: PASS.**

## Overall Results

| Corrected file | Main run | Edge-case assertions | Result |
|---|---|---|---|
| `bug1_fixed.py` | PASS | 3 tests passed | PASS |
| `bug2_fixed.py` | PASS | 4 tests passed | PASS |
| `bug3_fixed.js` | PASS | 7 tests passed | PASS |
| `bug4_fixed.js` | PASS | 4 tests passed | PASS |
| `bug5_fixed.c` | PASS | 6 tests passed | PASS |
| `bug6_fixed.c` | PASS | 4 tests passed | PASS |

**Total:** 34 passing checks across 6 corrected files; 0 failed.

## What Changed and What Did Not

- Applied exactly one root-cause correction per snippet, matching the suggestions in `ai_debug_log.md`.
- Added no unrelated changes to program behavior. The buggy source files remain in `bug_snippets/` for earlier exercises.
- For `bug6_fixed.c`, the successful confirmation output includes its original prompt: `Type CONFIRM to proceed: Action confirmed`.
- `bug1_fixed.py` has a syntax fix; `bug2_fixed.py`, `bug3_fixed.js`, `bug5_fixed.c`, and `bug6_fixed.c` correct wrong values; `bug4_fixed.js` prevents a runtime exception.
- No alternative AI fixes were proposed, so no alternative implementations required comparison.

## Summary

All corrected programs run as intended for the documented normal cases, and the edge-case assertions passed. **Validation confirms tested behavior, not mathematical proof of correctness for every possible input.**

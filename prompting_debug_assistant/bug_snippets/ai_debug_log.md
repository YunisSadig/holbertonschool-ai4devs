# AI Debug Log — Prompting a Debugging Assistant

**AI assistant:** ChatGPT (GPT-6)  
**Date:** November 6, 2026  
**Languages:** Python 3, JavaScript (Node.js), C11  
**Source directory:** `prompting_debug_assistant/bug_snippets/`  
**Method:** The same question below was applied to the source of **each of the six buggy files**, with its observed error or unexpected output. The AI proposed **one minimal fix per bug**. I reproduced the original behavior and ran the corrected code in temporary copies, leaving the original snippets deliberately buggy for Task 0.

> **Prompt used for every snippet:** "This code throws an error / doesn't behave as expected. Can you identify and explain the issue and how to fix it?"

---

## Bug 1 – `bug1.py`

**Intended Behavior:** Compute the arithmetic mean of a grade list; return `None` for an empty list.

**AI Diagnosis:** The condition `if not grades` is missing the required colon (`:`). Python parses the entire file before executing it, so this is a **syntax error**, not a problem with the average formula. The subsequent `return` never runs until the syntax is corrected.

**Observed Error (original):** Running `python3 bug1.py` exited with code 1:

```text
File "bug1.py", line 6
    if not grades
                 ^
SyntaxError: expected ':'
```

**Suggested Fix:** Add the colon; preserve the empty-list guard.

```python
# Before
if not grades
    return None

# After
if not grades:
    return None
```

**Alternative Fixes Tested:** None. The AI proposed one minimal syntax correction.

**Validation:** Executed the original and fixed versions with `python3 bug1.py`. The fixed version exited successfully and printed:

```text
Average grade: 83.33333333333333
```

Additional assertions passed: `average_grade([]) is None` and `average_grade([4, 8]) == 6.0`.

**Result:** **PASS** — syntax error removed; expected average and empty-list handling confirmed.

---

## Bug 2 – `bug2.py`

**Intended Behavior:** Return exactly the last `n` activity entries, in their original order. Handle `n = 0`, the full list length, and invalid counts.

**AI Diagnosis:** The loop uses `range(start, len(entries) - 1)`. Python's `range` **excludes its stop argument**, so the final index is never visited. This is an **off-by-one error**, especially visible when requesting one or all entries.

**Observed Behavior (original):** `python3 bug2.py` exited with code 0 but returned the wrong result:

```text
Recent two: ['bookmark']
```

**Suggested Fix:** Use `len(entries)` as the exclusive stop index.

```python
# Before
for index in range(start, len(entries) - 1):
    result.append(entries[index])

# After
for index in range(start, len(entries)):
    result.append(entries[index])
```

**Alternative Fixes Tested:** None. The AI proposed one minimal change to the loop boundary.

**Validation:** The corrected program produced:

```text
Recent two: ['bookmark', 'logout']
```

Additional assertions passed for `n = 0`, `n = 1`, `n = 2`, `n = len(entries)`, and an invalid count that raises `ValueError`.

**Result:** **PASS** — correct number and order of returned entries, including boundary cases.

---

## Bug 3 – `bug3.js`

**Intended Behavior:** Apply a 10% discount only if **both** conditions hold: the customer is a member **and** the subtotal is at least $100.

**AI Diagnosis:** The promotion condition uses the logical **OR** operator `||`. OR grants a discount whenever *either* condition is true, so an ineligible member or a nonmember with a large subtotal receives it. The intended rule requires logical **AND** `&&`. This is a **logic error**; JavaScript does not throw an exception.

**Observed Behavior (original):** `node bug3.js` exited with code 0 but printed:

```text
Member, $80: 72
Guest, $120: 108
Member, $120: 108
```

The first two discounts are incorrect.

**Suggested Fix:** Replace `||` with `&&`.

```javascript
// Before
if (isMember || subtotal >= 100) {
  discount = subtotal * 0.10;
}

// After
if (isMember && subtotal >= 100) {
  discount = subtotal * 0.10;
}
```

**Alternative Fixes Tested:** None. The AI proposed one minimal Boolean-operator correction.

**Validation:** The corrected program produced:

```text
Member, $80: 80
Guest, $120: 120
Member, $120: 108
```

Node.js assertions also passed for all four eligibility combinations: member/guest and below/above the threshold.

**Result:** **PASS** — the 10% discount is applied only to eligible purchases.

---

## Bug 4 – `bug4.js`

**Intended Behavior:** Print each customer and a lowercase city, substituting `unknown` when the address or city is missing; do not stop processing subsequent customers.

**AI Diagnosis:** `customer.address.city` assumes that every customer has an `address` object. For Murad, `address` is `undefined`, and trying to access `.city` on it triggers a **TypeError**. The program exits before printing Leyla's destination. Optional chaining can safely navigate absent properties, and nullish coalescing can provide a fallback.

**Observed Error (original):** `node bug4.js` printed `Ayla - baku` and then exited with code 1:

```text
TypeError: Cannot read properties of undefined (reading 'city')
    at formatDestination (.../bug4.js:5:33)
    at printDestinations (.../bug4.js:11:17)
```

**Suggested Fix:** Use optional chaining for both potentially absent properties and a fallback value.

```javascript
// Before
const city = customer.address.city.toLowerCase();

// After
const city = customer.address?.city?.toLowerCase() ?? "unknown";
```

**Alternative Fixes Tested:** None. The AI proposed one concise defensive-access correction.

**Validation:** The corrected program exited successfully and printed:

```text
Ayla - baku
Murad - unknown
Leyla - brno
```

Additional assertions passed for a missing `address`, an empty `address` object, and a valid uppercase city.

**Result:** **PASS** — missing address data no longer crashes processing.

---

## Bug 5 – `bug5.c`

**Intended Behavior:** Calculate the completion percentage from two integer counts; for 3 completed assignments out of 4, return 75.0%.

**AI Diagnosis:** Both `completed` and `assigned` are `int`. Consequently, `completed / assigned` performs **integer division**, truncating `3 / 4` to `0` *before* multiplication by `100.0`. Assigning the result to `double` afterward cannot recover the lost fraction. At least one operand must be converted to floating point **before division**.

**Observed Behavior (original):** Compiled successfully with `gcc -std=c11 -Wall -Wextra bug5.c -o bug5`, but the program printed:

```text
Completed: 3 of 4
Completion: 0.0%
```

**Suggested Fix:** Cast `completed` to `double` before dividing.

```c
// Before
double percentage = (completed / assigned) * 100.0;

// After
double percentage = ((double)completed / assigned) * 100.0;
```

**Alternative Fixes Tested:** None. The AI proposed one explicit-cast correction.

**Validation:** The corrected program compiled with GCC C11 and exited successfully:

```text
Completed: 3 of 4
Completion: 75.0%
```

Additional C assertions passed for `3/4 -> 75.0`, `4/4 -> 100.0`, `0/4 -> 0.0`, and the existing invalid-denominator sentinel `1/0 -> -1.0`.

**Result:** **PASS** — fractional percentages are now calculated correctly.

---

## Bug 6 – `bug6.c`

**Intended Behavior:** Accept user input only when the entered characters exactly match `CONFIRM` (case-sensitive), then print `Action confirmed`.

**AI Diagnosis:** In C, `entered == expected` compares **pointer addresses**, not the characters inside strings. `entered` points to the input buffer, while `expected` points to a string literal. They are different memory locations even when the contents match. Use the standard library's `strcmp()` for a content comparison; this file already includes `<string.h>`.

**Observed Behavior (original):** The program compiled, but this command rejected valid input:

```bash
printf 'CONFIRM\n' | ./bug6
```

```text
Type CONFIRM to proceed: Action rejected
```

**Suggested Fix:** Check whether `strcmp()` returns zero (strings are equal).

```c
// Before
if (entered == expected) {
    return 1;
}

// After
if (strcmp(entered, expected) == 0) {
    return 1;
}
```

**Alternative Fixes Tested:** None. The AI proposed one standard-library string-comparison correction.

**Validation:** The corrected code compiled under `gcc -std=c11 -Wall -Wextra` and passed three input tests:

| Input | Actual result after fix | Status |
|---|---|---|
| `CONFIRM` | `Action confirmed` | PASS |
| `confirm` | `Action rejected` | PASS |
| `NO` | `Action rejected` | PASS |

**Result:** **PASS** — exact, case-sensitive string matching confirmed.

---

## Overall Test Summary

| File | Error type | Original behavior reproduced? | Proposed fix tested? | Result |
|---|---|---|---|---|
| `bug1.py` | Syntax | Yes: `SyntaxError` | Yes | PASS |
| `bug2.py` | Off-by-one | Yes: missing final entry | Yes | PASS |
| `bug3.js` | Logic | Yes: discounts ineligible orders | Yes | PASS |
| `bug4.js` | Runtime | Yes: `TypeError` | Yes | PASS |
| `bug5.c` | Data type | Yes: `0.0%` instead of `75.0%` | Yes | PASS |
| `bug6.c` | String comparison | Yes: valid input rejected | Yes | PASS |

**Testing tools:** Python 3, Node.js 22.16.0, GCC (`-std=c11 -Wall -Wextra`), and lightweight assertion-based edge-case tests.

**Reflection:** The AI identified a minimal, testable root cause for every snippet. The experiment illustrates why AI explanations should be checked through actual execution: two programs failed with exceptions, while four produced incorrect behavior without necessarily failing. For all six examples, the single proposed fix was verified by execution; **no alternative fixes were proposed, so there were no untested alternatives to report**. The original `bug1.py`–`bug6.c` files remain intentionally buggy for the collection task; corrections were applied only to temporary test copies.

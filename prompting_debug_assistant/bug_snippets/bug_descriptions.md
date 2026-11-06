# Bug Descriptions

These six **intentionally buggy** programs contain 10–40 lines of source code each and span Python, JavaScript and C. The snippets must remain unfixed for Task 0; subsequent tasks will diagnose and correct them.

## Bug 1 – bug1.py

**Intended Behavior:** Calculate the arithmetic mean of a nonempty list of grades, or return `None` for an empty list.

**Issue Type:** Syntax error

**Language:** Python 3

**How to Reproduce:** `python3 bug1.py`

**Expected Output:** `Average grade: 83.33333333333333`

**Notes:** The missing colon in `if not grades` causes `SyntaxError` before the program runs.

## Bug 2 – bug2.py

**Intended Behavior:** Return exactly the last `n` log entries in their original order; return `[]` for `n = 0` and reject invalid counts.

**Issue Type:** Off-by-one / loop boundary

**Language:** Python 3

**How to Reproduce:** `python3 bug2.py`

**Expected Output:** `Recent two: ['bookmark', 'logout']`

**Notes:** The loop's exclusive end bound incorrectly skips the final element, producing `['bookmark']`.

## Bug 3 – bug3.js

**Intended Behavior:** Apply a 10% discount only if the customer is a member **and** the subtotal is at least $100.

**Issue Type:** Logical / Boolean condition

**Language:** JavaScript / Node.js

**How to Reproduce:** `node bug3.js`

**Expected Output:** Member $80 -> $80; guest $120 -> $120; member $120 -> $108.

**Notes:** The code uses `||` instead of `&&`, so customers meeting only one condition receive the discount.

## Bug 4 – bug4.js

**Intended Behavior:** Print each customer name and lowercase city; use `unknown` for missing addresses without stopping the loop.

**Issue Type:** Runtime exception / missing property

**Language:** JavaScript / Node.js

**How to Reproduce:** `node bug4.js`

**Expected Output:** `Ayla - baku`, `Murad - unknown`, `Leyla - brno` on separate lines.

**Notes:** `customer.address.city` throws a `TypeError` for Murad because `address` is missing.

## Bug 5 – bug5.c

**Intended Behavior:** Compute the completion percentage from integer counts, returning a fractional percentage when necessary.

**Issue Type:** Data-type misuse / integer division

**Language:** C11

**How to Reproduce:** `gcc -std=c11 -Wall -Wextra bug5.c -o bug5 && ./bug5`

**Expected Output:** `Completed: 3 of 4` followed by `Completion: 75.0%`.

**Notes:** The division `completed / assigned` is integer division, so `3 / 4` truncates to `0` and prints `0.0%`.

## Bug 6 – bug6.c

**Intended Behavior:** Read a confirmation word and accept only a case-sensitive content match to `CONFIRM`.

**Issue Type:** Incorrect string comparison / pointer semantics

**Language:** C11

**How to Reproduce:** `gcc -std=c11 -Wall -Wextra bug6.c -o bug6 && printf 'CONFIRM\n' | ./bug6`

**Expected Output:** `Action confirmed` after the prompt.

**Notes:** The `==` expression compares C string addresses, not characters; the entered `CONFIRM` is rejected.

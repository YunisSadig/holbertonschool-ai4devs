# Structured Bug Reports — AI-Assisted Debugging

**Project:** Prompting a Debugging Assistant  
**Date:** November 6, 2026  
**AI assistant:** ChatGPT (GPT-6)  
**Original code:** `prompting_debug_assistant/bug_snippets/`  
**Corrected code:** `prompting_debug_assistant/bug_fixes/`  
**Evidence:** `bug_snippets/ai_debug_log.md` and `bug_fixes/fix_validation.md`

These reports document six intentionally flawed programs, the AI's minimal suggested corrections, and the independently executed tests. The original snippets remain unchanged; each correction is saved as a separate `_fixed` file.

## Bug Report 1 – `bug1.py`

- **File Name:** `bug1.py` (corrected: `bug_fixes/bug1_fixed.py`)
- **Bug Summary:** The program cannot run because Python raises `SyntaxError: expected ':'` at the empty-grades condition.
- **Root Cause:** The statement `if not grades` is missing a colon. Python rejects the file during parsing, before the average is calculated.
- **Resolution — AI Suggestion:** Change `if not grades` to `if not grades:`. Keep the existing `return None` for an empty list.
- **Manual Edits:** None beyond applying the AI's single suggested correction to a separate fixed file; tests were written and executed for verification.
- **Validation:** `python3 bug1_fixed.py` printed `Average grade: 83.33333333333333`. Tests for an empty list (`None`), `[4, 8]` (`6.0`), and `[0]` (`0.0`) also passed.
- **Lessons Learned:** Syntax must be valid before runtime behavior can be tested. Run a parser or interpreter early, and test both ordinary and empty inputs.

## Bug Report 2 – `bug2.py`

- **File Name:** `bug2.py` (corrected: `bug_fixes/bug2_fixed.py`)
- **Bug Summary:** Requesting the last two activity entries returns only one: `['bookmark']` instead of `['bookmark', 'logout']`.
- **Root Cause:** `range(start, len(entries) - 1)` omits the final element because Python's `range` stop boundary is exclusive.
- **Resolution — AI Suggestion:** Replace the loop header with `for index in range(start, len(entries)):` to include the last valid index.
- **Manual Edits:** None beyond the AI's suggested loop-bound correction; separate tests checked boundary conditions.
- **Validation:** `python3 bug2_fixed.py` returned `['bookmark', 'logout']` for the example. Tests also passed for `n = 0`, `n = 1`, `n = len(entries)`, and invalid `n` values raising `ValueError`.
- **Lessons Learned:** Boundary conditions expose off-by-one mistakes. Explicitly test zero, one, full length, and invalid lengths for index-based loops.

## Bug Report 3 – `bug3.js`

- **File Name:** `bug3.js` (corrected: `bug_fixes/bug3_fixed.js`)
- **Bug Summary:** The discount function awards 10% discounts to customers who satisfy only one of the two eligibility conditions.
- **Root Cause:** The predicate `isMember || subtotal >= 100` uses logical OR, while the rule requires both membership and a subtotal of at least $100.
- **Resolution — AI Suggestion:** Replace `||` with `&&`: `if (isMember && subtotal >= 100) { ... }`.
- **Manual Edits:** None beyond applying the AI's suggested Boolean change; additional assertions covered the eligibility combinations.
- **Validation:** `node bug3_fixed.js` returned `$80` for a member spending $80, `$120` for a guest spending $120, and `$108` for a member spending $120. Tests also passed at the $100 threshold, at zero, and for negative input rejection.
- **Lessons Learned:** A program may run without exceptions yet violate business rules. Translate requirements into Boolean truth-table test cases.

## Bug Report 4 – `bug4.js`

- **File Name:** `bug4.js` (corrected: `bug_fixes/bug4_fixed.js`)
- **Bug Summary:** Printing customer destinations stops at the second customer with `TypeError: Cannot read properties of undefined (reading 'city')`.
- **Root Cause:** `customer.address.city.toLowerCase()` assumes every customer has an `address` object. The second customer has no `address` property.
- **Resolution — AI Suggestion:** Use optional chaining and a fallback: `const city = customer.address?.city?.toLowerCase() ?? "unknown";`.
- **Manual Edits:** None beyond the AI's proposed defensive property access; edge cases were tested separately.
- **Validation:** `node bug4_fixed.js` printed `Ayla - baku`, `Murad - unknown`, and `Leyla - brno`. Tests passed for a missing address, missing city, a null city, and a valid city.
- **Lessons Learned:** Treat optional nested properties as potentially absent. Verify that one malformed record cannot halt processing of later records.

## Bug Report 5 – `bug5.c`

- **File Name:** `bug5.c` (corrected: `bug_fixes/bug5_fixed.c`)
- **Bug Summary:** The completion percentage for 3 out of 4 assignments is printed as `0.0%` rather than `75.0%`.
- **Root Cause:** `completed / assigned` uses integer division because both operands are `int`; the fraction is truncated before multiplication by `100.0`.
- **Resolution — AI Suggestion:** Convert one operand to floating point before division: `double percentage = ((double)completed / assigned) * 100.0;`.
- **Manual Edits:** None beyond applying the AI's explicit-cast correction; an assertion harness was used for additional cases.
- **Validation:** Compiled using `gcc -std=c11 -Wall -Wextra -Werror`; the fixed program printed `Completion: 75.0%`. Tests passed for 3/4, 4/4, 0/4, zero total, negative completed count, and completed count exceeding total.
- **Lessons Learned:** Casting an already truncated result cannot recover lost precision. Perform conversions before arithmetic that requires fractional results.

## Bug Report 6 – `bug6.c`

- **File Name:** `bug6.c` (corrected: `bug_fixes/bug6_fixed.c`)
- **Bug Summary:** Entering `CONFIRM` is incorrectly rejected, even though it exactly matches the expected confirmation word.
- **Root Cause:** `entered == expected` compares pointer addresses in C, rather than the text stored at those addresses.
- **Resolution — AI Suggestion:** Use `strcmp(entered, expected) == 0` to compare string contents. The necessary `<string.h>` header was already present.
- **Manual Edits:** None beyond the AI's suggested condition replacement; standard input cases were supplied for testing.
- **Validation:** Compiled using `gcc -std=c11 -Wall -Wextra -Werror`. Input `CONFIRM` produced `Action confirmed`; `confirm`, `NO`, and `CONFIRMATION` were rejected, as intended.
- **Lessons Learned:** In C, pointer equality does not establish string equality. Use standard string functions and test exact matches, case changes, and partial matches.

## Overall Results and Reflection

| Original file | Category | Fixed file | Validated outcome |
|---|---|---|---|
| `bug1.py` | Syntax error | `bug1_fixed.py` | PASS |
| `bug2.py` | Off-by-one | `bug2_fixed.py` | PASS |
| `bug3.js` | Incorrect logic | `bug3_fixed.js` | PASS |
| `bug4.js` | Runtime exception | `bug4_fixed.js` | PASS |
| `bug5.c` | Integer division | `bug5_fixed.c` | PASS |
| `bug6.c` | String/pointer comparison | `bug6_fixed.c` | PASS |

**Validation summary:** 34 recorded checks passed across six corrected programs; no failures were recorded. The AI proposed one targeted correction per bug. **No additional manual code fixes or alternative AI fixes were necessary.** Human-led verification consisted of executing the corrected files and checking normal and edge-case inputs. Passing tests demonstrate correctness for the tested scenarios, not all possible inputs.

**Key takeaway:** AI can identify common bugs quickly, but the proposed fixes should be checked with executable tests, particularly for logical errors that produce plausible but incorrect output.

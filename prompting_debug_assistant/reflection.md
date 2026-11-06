# Reflection on AI-Assisted Debugging

## Introduction

For this project, I used ChatGPT to diagnose six intentionally flawed programs written in Python, JavaScript, and C. The examples covered syntax, loop boundaries, business logic, missing properties, numeric types, and string comparison. I documented the AI's suggestions in `bug_snippets/ai_debug_log.md`, saved corrected programs in `bug_fixes/`, and recorded 34 passing checks in `bug_fixes/fix_validation.md`. The exercise helped me distinguish a convincing explanation from a verified fix.

## AI Strengths

The easiest issue was the missing colon after `if not grades` in `bug1.py`: the parser error pointed directly to the problem. The off-by-one loop in `bug2.py` was also straightforward because Python's `range` excludes its upper bound. In `bug3.js`, the AI translated the requirement that *both* conditions must hold into the correct change from `||` to `&&`. These suggestions were small, readable, and easy to evaluate against expected outputs. For all six examples, the AI proposed one targeted correction rather than unnecessarily rewriting the programs.

## AI Limitations and Trust

The most demanding cases to reason about were the C examples. In `bug5.c`, `(completed / assigned) * 100.0` appears plausible, but integer division discards the fraction before multiplication. Casting **before** division was essential. In `bug6.c`, `entered == expected` compares pointer addresses, not the characters in two strings; the correct operation was `strcmp(entered, expected) == 0`. These bugs require understanding language semantics rather than simply recognizing an exception message. The JavaScript missing-address case also needed attention to null and undefined values.

None of the six AI suggestions required a subsequent manual code correction, and all documented tests passed. However, that does not justify unconditional trust. The examples were deliberately small, and tests cover selected inputs rather than every possible behavior. I would rate AI suggestions as useful hypotheses, not authoritative solutions.

## The Human Role

Human judgment was essential when defining what “correct” meant. For the discount function, I checked members and nonmembers on both sides of the $100 threshold; merely running the program would not reveal every logical mistake. For the activity log, I tested `n = 0`, `n = 1`, and `n = len(entries)`. For missing addresses and confirmation strings, I checked absent data and incorrect inputs. I also kept the original buggy files unchanged and compiled the C fixes with strict warnings. These decisions made the evidence reproducible.

## Conclusion

AI accelerated the *diagnosis and explanation* stage by providing precise candidate fixes, while executable tests supplied the actual evidence of correctness. I did not measure elapsed debugging time, so I cannot quantify a speed improvement. In real projects, I would combine AI assistance with specifications, regression tests, code review, and security checks. The central lesson is that AI is an effective debugging collaborator when developers remain responsible for validating its claims.

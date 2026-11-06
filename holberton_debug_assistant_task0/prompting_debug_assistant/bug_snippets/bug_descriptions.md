# Bug Descriptions

This collection contains **six intentionally flawed programs** across Python, JavaScript, Java, and C. Each file is between 10 and 40 lines long. The bugs are deliberate practice material for later AI-assisted debugging tasks; **do not fix the snippets for Task 0**.

## Bug 1 – `bug1.py`

- **Language:** Python 3
- **Intended behavior:** Compute the arithmetic mean of a nonempty list of numeric grades and return `None` for an empty list.
- **Issue type:** Syntax error.
- **How to reproduce:** Run `python bug1.py`.
- **Expected result:** `Average grade: 83.33333333333333`.
- **Observed problem:** Python reports a `SyntaxError` before the program can run, due to an incomplete conditional statement in the empty-input guard.

## Bug 2 – `bug2.py`

- **Language:** Python 3
- **Intended behavior:** Return exactly the last `n` entries of a list in their original order; return an empty list when `n` is zero; reject out-of-range requests.
- **Issue type:** Off-by-one / loop-boundary error.
- **How to reproduce:** Run `python bug2.py`.
- **Expected result:** `Recent two: ['bookmark', 'logout']`.
- **Observed problem:** Only `['bookmark']` is returned because the loop stops before processing the final list element.

## Bug 3 – `bug3.js`

- **Language:** JavaScript (Node.js)
- **Intended behavior:** Apply a 10% discount **only** if the shopper is a member **and** the subtotal is at least $100.
- **Issue type:** Logical/Boolean-condition error.
- **How to reproduce:** Run `node bug3.js`.
- **Expected result:** A member spending $80 pays `$80`, a guest spending $120 pays `$120`, and a member spending $120 pays `$108`.
- **Observed problem:** The first two shoppers incorrectly receive the discount even though each meets only one of the conditions.

## Bug 4 – `bug4.js`

- **Language:** JavaScript (Node.js)
- **Intended behavior:** Print `Name - city` for each customer, converting a present city to lowercase. If the address is missing, display `unknown` instead of crashing.
- **Issue type:** Runtime exception / missing nested property.
- **How to reproduce:** Run `node bug4.js`.
- **Expected result:** `Ayla - baku`, `Murad - unknown`, and `Leyla - brno`, on separate lines.
- **Observed problem:** The second customer has no `address` property, and accessing `customer.address.city` raises `TypeError` and prevents the third entry from being printed.

## Bug 5 – `Bug5.java`

- **Language:** Java
- **Intended behavior:** Multiply `unitPrice` by `quantity` to calculate the receipt total, then print a correctly formatted line such as `Total: 60 USD`.
- **Issue type:** Data type / string concatenation instead of arithmetic.
- **How to reproduce:** Run `javac Bug5.java && java Bug5`.
- **Expected result:** `Total: 60 USD` and `Total: 48 USD`.
- **Observed problem:** The output concatenates the numeric values into the receipt string instead of multiplying them (for example, `Total: 203 USD`).

## Bug 6 – `bug6.c`

- **Language:** C (C11)
- **Intended behavior:** Ask the user to type `CONFIRM` and accept the action if the entered text exactly matches that confirmation word.
- **Issue type:** Misuse of string comparison / pointer semantics.
- **How to reproduce:** Compile using `gcc -std=c11 -Wall -Wextra bug6.c -o bug6` and run `printf 'CONFIRM\n' | ./bug6`.
- **Expected result:** `Action confirmed` after the input is accepted.
- **Observed problem:** It prints `Action rejected`. The code compares the addresses of two C strings instead of their contents.

## Coverage Summary

| Category | Example |
| --- | --- |
| Syntax error | `bug1.py` |
| Off-by-one / loop logic | `bug2.py` |
| Logic error | `bug3.js` |
| Runtime exception | `bug4.js` |
| Data type misuse | `Bug5.java` |
| C string/library misuse | `bug6.c` |

**Scope:** These are intentionally buggy inputs for analysis, not fixed solutions. Subsequent tasks can ask an AI assistant to explain root causes and propose verified corrections.

# Benchmark Tasks — Copilot Productivity Sprint

Three small coding tasks for the manual-versus-AI comparison. Each is meant to be solvable in **15–30 minutes** by a developer comfortable with JavaScript (Node.js v24). The 15–30 minute range is a design target, not a measurement: no timings have been recorded yet.

**Conventions for all tasks**
- Language: JavaScript (CommonJS), no external packages. Tests use the built-in `node --test` runner.
- Each solution is a single module (named per task) exporting the functions below, plus a test file written by the solver.
- Hidden check: the acceptance criteria below are the pass/fail definition; a task counts as done only when all of them hold.
- Do the same task twice: once manually (AI off), once with AI assistance, using a fresh copy of the starter folder each time.

---

## Task 1 - User Store with Validation (CRUD)
**Requirements**: Implement an in-memory user store in `users.js` with `createUser`, `getUser`, `updateUser`, `deleteUser` and `listUsers`. Names must be non-empty strings (after trimming); emails must be valid and unique (case-insensitive). IDs are incrementing integers starting at 1 and are never reused.
**Inputs**: `createUser({ name, email })`, `getUser(id)`, `updateUser(id, { name?, email? })`, `deleteUser(id)`, `listUsers()`.
**Outputs**: User objects `{ id, name, email }`. Invalid input throws an `Error` whose `code` property is `"VALIDATION"`. An unknown id throws an `Error` with `code` `"NOT_FOUND"`. `listUsers()` returns an array ordered by id.
**Acceptance Criteria**:
- `createUser({ name: " Ada ", email: "ada@example.com" })` returns `{ id: 1, name: "Ada", email: "ada@example.com" }`
- Creating a user with an invalid email (`"ada@"`) throws `code: "VALIDATION"`
- Creating a second user with `"ADA@example.com"` throws `code: "VALIDATION"` (duplicate email, case-insensitive)
- `getUser(999)` throws `code: "NOT_FOUND"`
- After `deleteUser(1)`, the next created user gets id 2, not 1
- `updateUser` that would duplicate another user's email throws `code: "VALIDATION"` and leaves the user unchanged
- At least 6 passing tests written by the solver

---

## Task 2 - CSV Parser
**Requirements**: Implement `parseCsv(text)` in `csv.js` that parses RFC 4180-style CSV: comma-separated fields, double-quoted fields may contain commas, line breaks and escaped quotes (`""`). The first row is the header. Handle both `\n` and `\r\n` line endings and ignore a single trailing newline.
**Inputs**: A string of CSV text.
**Outputs**: An array of objects keyed by the header names, with all values as strings. A row with the wrong number of fields throws an `Error` whose message contains the 1-based line number of the offending row.
**Acceptance Criteria**:
- `parseCsv("name,age\nAda,36\n")` returns `[{ name: "Ada", age: "36" }]`
- `parseCsv('a,b\n"x, y","say ""hi"""')` returns `[{ a: "x, y", b: 'say "hi"' }]`
- A quoted field containing a newline stays in one record
- `\r\n` input gives the same result as `\n` input
- A header-only input returns `[]`
- A row with too few or too many fields throws an error that mentions its line number
- At least 6 passing tests written by the solver

---

## Task 3 - Fixed-Window Rate Limiter
**Requirements**: Implement `createRateLimiter({ limit, windowMs, now })` in `ratelimit.js`. It returns an object with `check(key)` that allows at most `limit` calls per key within each fixed window of `windowMs` milliseconds. `now` is an optional function returning the current time in milliseconds (defaults to `Date.now`) so that tests can control time. Windows start at the first call for a key.
**Inputs**: Options `{ limit: positive integer, windowMs: positive integer, now?: () => number }`; calls to `check(key)` with a string key.
**Outputs**: `check(key)` returns `{ allowed: boolean, remaining: number, retryAfterMs: number }`. `retryAfterMs` is `0` when allowed, otherwise the time left in the current window. Invalid options throw a `TypeError`.
**Acceptance Criteria**:
- With `limit: 3`, the first three calls for a key return `allowed: true` with `remaining` 2, 1, 0
- The fourth call returns `allowed: false`, `remaining: 0` and `retryAfterMs` greater than 0
- Different keys are counted independently
- After `windowMs` has passed (using an injected clock), the key is allowed again with a fresh count
- `retryAfterMs` equals the exact time left in the window (for example 1000 when 4000 ms of a 5000 ms window have elapsed)
- `createRateLimiter({ limit: 0, windowMs: 1000 })` throws `TypeError`
- At least 6 passing tests written by the solver

---

## Measurement plan (for the later experiment)
For each task and each mode (manual, AI-assisted) the experiment should record: minutes taken (measured with a timer), number of test runs until all acceptance criteria pass, number of acceptance criteria met on the first run, and lines of code. These fields are defined here only; no results exist yet.

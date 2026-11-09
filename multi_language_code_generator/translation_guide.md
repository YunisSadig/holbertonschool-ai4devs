# Translation Guide - Log Analyzer

Notes from translating one algorithm (see `cross_language_spec.md`) from Python into JavaScript and Java. Every pitfall listed here was hit, or checked, while building the code in `implementations/`.

## Python -> JavaScript

### Idiomatic differences
- `dict` -> `Map` (or a plain object). A `Map` keeps insertion order and allows number keys; a plain object turns every key into a string and orders integer-like keys numerically.
- `sorted(items, key=...)` -> `Array.prototype.sort((a, b) => ...)` with a comparator that returns a number. Without a comparator JavaScript sorts as text, so `10` sorts before `9`.
- `re.fullmatch(p, s)` -> a regex anchored with `^...$` and `.test()` / `.exec()`.
- Reading a file line by line (`for raw in f`) -> read chunks with `fs.readSync`, decode, split on `\n`, and carry the unfinished last line into the next chunk.
- Exceptions (`OSError`) -> `try/catch` plus an exit code set on `process.exitCode`.
- Integers: Python `int` is unbounded; JavaScript numbers are doubles (exact up to 2^53). Fine for counts here, a risk for much larger sums.

### Common pitfalls
- **`\S` and `\s` are Unicode-aware in JavaScript**, while the spec is ASCII. A non-breaking space would split a field in JavaScript but not in Python (`re.ASCII`). The fix was to spell the class out: `[^ \t\n\r\f\v]`.
- `JSON.stringify` prints `0.6667` and `1` exactly as needed, but it is the only language here that does so without extra care (see Java and Python below).
- Forgetting `+ 1` or an anchor in the rounding formula, because `Math.round` rounds half toward positive infinity and floats can be off by a hair. The spec's integer formula avoids it.

### Best practices
- Put the logic in a pure function (`analyze(text)`) and keep I/O in a thin `main`, so the same fixtures can test both the API and the CLI.
- Use `node:test` and `node:assert`: no dependencies needed.

## Python -> Java

### Idiomatic differences
- Dynamic dict/list literals -> typed generics (`Map<String, Long>`, `List<...>`); `TreeMap` gives sorted keys for free.
- Duck typing -> declared types; integer division is the default for `long / long` (Python needs `//`).
- No built-in JSON: a small hand-written serializer prints the canonical format (2-space indent, fixed key order).
- Exceptions: checked `IOException` must be caught or declared; exit codes use `System.exit`.
- One public class per file, compiled with `javac` before it runs.

### Common pitfalls
- **Number formatting.** `Double.toString(0.0001)` is `1.0E-4`, which is not valid output. The fix was to hold the rate as a `BigDecimal` built from an integer (`BigDecimal.valueOf(scaled, 4).stripTrailingZeros()`) and print it with `toPlainString()`. A first version formatted the rate as a `String` helper, which made the code look as if it quoted the number; returning a numeric type is clearer.
- **`String.split("\n")` drops trailing empty strings**, unlike Python's `str.split('\n')`; `split("\n", -1)` keeps them. Blank lines are ignored in this spec anyway, but the difference matters elsewhere.
- **Default charsets.** Read bytes and decode explicitly with UTF-8 instead of relying on the platform default.
- **Regex escaping.** In a Java string every backslash is doubled (`"\\S+"`).
- Autoboxing: map values are `Long` objects, so use `merge(key, 1L, Long::sum)`.

### Best practices
- Keep the translation structurally close to the reference (`feed`, `parseLine`, `toCanonicalJson`) so reviewers can compare line by line.
- Test with the same fixture files as the other languages and compare **bytes**, not just parsed values.

## Pitfalls that apply to every language (found by testing)
- **Python on Windows translated `\n` to `\r\n` when printing**, so its output differed from the other languages. Writing bytes to `sys.stdout.buffer` fixed it. Only a byte-for-byte comparison caught this.
- **Python's `round` uses half-to-even.** The spec defines round-half-up with integer arithmetic so all languages agree.
- **Whole numbers in JSON**: Python prints `1.0` for a float `1`. The code converts whole values to `int` before serializing.
- **Git can silently change test data.** With `core.autocrlf=true`, a fixture that deliberately contained CRLF was committed with LF. A `.gitattributes` rule (`tests/fixtures/* -text`) stores the bytes exactly.

## Best practices summary
1. Write the specification first, with exact rules for sorting, rounding and number formatting.
2. Verify expected outputs with an independent implementation before trusting them.
3. Share one set of fixtures between all languages and compare bytes.
4. Add a cross-language runner (`tests/run_all.py`) so equivalence is checked in one command.
5. Measure performance only after equivalence passes, and report limits honestly.

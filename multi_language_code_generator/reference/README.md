# Python reference implementation - Log Analyzer

Implements `../cross_language_spec.md` using only the Python 3 standard library.

- `log_analyzer.py` - `LogAnalyzer.parse_line`, `LogAnalyzer.analyze`, and a CLI.
- `tests/test_log_analyzer.py` - 16 tests (6 specification cases loaded from `tests/fixtures/tc_*.json`, 8 unit tests, 2 CLI tests).
- `tests/fixtures/` - the six spec test cases; expected values were produced by a separate Node.js check of the spec.

Run (from this folder):

```sh
python -m unittest discover -s tests -v
python log_analyzer.py some_access.log
```

Verified with Python 3.13.

# Implementations

Three versions of the Log Analyzer from `../cross_language_spec.md`. All print byte-identical canonical JSON.

| Language | Path | Run |
|---|---|---|
| Python 3.13 | `python/log_analyzer.py` (same code as `../reference/`) | `python python/log_analyzer.py <log>` |
| JavaScript (Node.js 24) | `javascript/log_analyzer.js` | `node javascript/log_analyzer.js <log>` |
| Java 21 | `java/LogAnalyzer.java` | `javac -d ../build/java java/LogAnalyzer.java` then `java -cp ../build/java LogAnalyzer <log>` |

Tests live in `../tests/<language>/` and share the fixtures in `../tests/fixtures/`. Run everything with `python ../tests/run_all.py`.

# Tests - jQuery 1.12.4 characterization suite

`jquery_characterization.test.js` contains **18 runnable unit tests** (Node.js built-in test runner + jsdom) that pin down what jQuery 1.12.4 actually does today, including its quirks. They are meant as a safety net before changing or replacing the library.

```sh
cd legacy_code_interpreter/tests
npm install
npm test                                   # runs against vendor/jquery-1.12.4.js
JQUERY_PATH=/path/to/other/jquery.js JQUERY_EXPECT_VERSION=3.7.1 node --test jquery_characterization.test.js
```

`vendor/jquery-1.12.4.js` is the official `dist/jquery.js` from tag `1.12.4` (MIT license; SHA-256 `430f36f9b5f21aae8cc9dca6a81c4d3d84da5175eaedcf2fdc2c226302cb3575`, identical to the file tracked in the jQuery repository at that tag).

## What is covered
| Area | Tests |
|---|---|
| Library version | 1 |
| `jQuery.extend` (shallow, deep, arrays, skipped values, cloning) | 3 |
| `jQuery.fn.init` (`$()` argument types, `$(html, props)`) | 2 |
| Events (delegation order, `stopImmediatePropagation`, `return false`, namespaces) | 2 |
| `Deferred` (chaining and adoption, synchronous callbacks, exception propagation) | 3 |
| Ajax converters (json, `dataFilter`, `parsererror`, custom and two-step converters, `script` evaluation) | 3 |
| Callbacks, data/attributes, traversing/manipulation | 3 |
| Prototype-pollution behavior (CVE-2019-11358 pattern) | 1 |

Ajax tests use an in-memory transport, so no network is needed. Each test loads jQuery into a fresh jsdom window.

## Results (run on 2026-11-09, Node.js v24.18.0, jsdom 31)
| jQuery version | Passed | Failed |
|---|---|---|
| **1.12.4** (default) | **18** | 0 |
| 3.7.1 (npm `jquery@3.7.1`) | 14 | 4 |
| 4.0.0 (npm `jquery@4.0.0`) | 14 | 4 |

### Migration experiment: what changes when the same tests run on newer jQuery
The same four tests fail on both 3.7.1 and 4.0.0; the other 14 behaviors are unchanged:
1. `deferred: values flow through chained then() calls...` - results arrive **asynchronously** in the newer versions, so reading the value right after `resolve()` finds nothing.
2. `deferred: legacy 1.x behavior - callbacks are synchronous` - no longer true.
3. `deferred: legacy 1.x behavior - an exception in a then callback propagates to resolve()` - no longer true.
4. `security: deep extend of a "__proto__" key pollutes Object.prototype` - the newer versions **do not pollute** (this failure is the desired outcome: the vulnerability is gone).

Everything else, including delegation order, `extend` semantics, the Ajax converter pipeline and DOM traversal/manipulation, behaved the same on 3.7.1 and 4.0.0 in these tests. This covers only what these 18 tests exercise; it is not a proof of full compatibility.

**A false lead worth recording:** my first run on the newer versions also failed the `script` dataType test. That was a test-setup problem, not a jQuery change: newer jQuery evaluates script text by injecting a `<script>` element, which jsdom runs only with `runScripts: "dangerously"`. After switching the suite to that mode (page content is static), the test passes on all three versions.

## Limits
- jsdom is not a real browser; no old-browser behavior (the `Support:` branches) is exercised.
- The upstream jQuery QUnit suite (`test/` in the jQuery repository) was not run.

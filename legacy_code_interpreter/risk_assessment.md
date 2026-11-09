# Risk Assessment - jQuery 1.12.4

Codebase: jQuery 1.12.4 (tag `1.12.4`, commit `f55d0ec8f28d648ac6429d03f1e2102d85912e86`, released 2016-05-20). Background and measurements are in `codebase_overview.md`; code-level evidence is in `ai_explanations.md` and `validation/`.

## Severity scale
- **High:** a realistic path to a security incident or to being unable to keep the software working, and fixing it needs a version change or significant work.
- **Medium:** it slows or endangers maintenance or migration, but it can be managed with known steps.
- **Low:** an annoyance or a small risk with an easy workaround.

Severity is my judgment of likelihood times impact for **an application that still ships this version**. It is not a CVSS score.

## Risk table
| # | Risk | Severity | Notes (evidence) |
|---|------|----------|------------------|
| 1 | **Documented security vulnerabilities in this version range** | **High** | NVD (checked 2026-11-09) lists CVE-2015-9251 (before 3.0.0), CVE-2019-11358 (before 3.4.0), CVE-2020-11022 (1.12.0 to before 3.5.0) and CVE-2020-11023 (1.0.3 to before 3.5.0). The matching code is in the source: the `"text script"` converter (`src/ajax/script.js` 16-20), `jQuery.extend` with no `__proto__` guard (`src/core.js` 123-190) and the `rxhtmlTag` replacement in `jQuery.htmlPrefilter` (`src/manipulation.js` 33, 288-290). Prototype pollution was reproduced in an isolated jsdom window (`validation/validation_output.txt`). |
| 2 | **Version is unmaintained: no upstream fixes** | **High** | Released 2016-05-20, about 10.5 years ago. CONTRIBUTING.md says "We cannot fix bugs in older released files". New problems will not be fixed in 1.12.4. |
| 3 | **Prototype pollution can break unrelated code** | **High** | After a deep `extend` with an own `__proto__` key, `Object.prototype` gained an extra property, and jQuery's own `for...in` loops then failed (`jqXHR[i] is not a function` in `jQuery.ajax`). So untrusted JSON merged with `$.extend(true, ...)` can disable features, not only leak data. |
| 4 | **Heavy legacy browser-compatibility code** | **Medium** | 80 `Support:` comments and 148 IE-related lines in 30 files. Changing code means understanding conditional branches written for IE<9, Android 2.3 and others, which are hard to test today. |
| 5 | **Global `$`/`jQuery` and plugin coupling make upgrades risky** | **Medium** | The library installs global `jQuery`/`$` and plugins extend `jQuery.fn` (`src/exports/global.js`, `src/core.js`). Apps and plugins depend on behavior that changes between major versions; the deprecated `bind`/`unbind`/`delegate`/`undelegate` are still present in `src/deprecated.js`. |
| 6 | **Promise-like `Deferred` behaves differently from native Promises** | **Medium** | Validated: callbacks run synchronously; an exception thrown in a `then` callback propagates instead of becoming a rejection; a returned native `Promise` is not adopted. Migrating code to `async/await` can change timing and error handling without any visible failure. |
| 7 | **Dated build and test toolchain with many vulnerable dev dependencies** | **Medium** | It installs and works on Node.js v24.18.0 (`grunt lint` and `grunt` pass), but `npm audit` reports 82 vulnerabilities in the dev dependency tree (1 low, 19 moderate, 49 high, 13 critical) and many deprecation warnings (for example `core-js@0.9.17`). Build-time only, because `dependencies` is empty, which is why this is Medium and not High. `.travis.yml` still targets Node.js 0.10 to 6. |
| 8 | **Regression safety net is hard to run** | **Medium** | About 686 unit-test registrations in 24 files use QUnit 1.17.1 and a browser page (`test/index.html`). I could run lint, the build and the Node smoke tests, but not the browser suite, so a modernization effort needs a browser test runner set up first. |
| 9 | **Large, multi-purpose modules** | **Low** | `src/event.js` has 1,134 lines and `src/ajax.js` 842; `$()` dispatch (`src/core/init.js`) handles seven input types in one function. Harder to read, but covered by tests and stable. |
| 10 | **Limited platform support (browser only)** | **Low** | README: the 1.x branch does not support Node or other non-browser environments; Sizzle cannot be removed on 1.x. Matters only if the app needs server-side rendering or extensions. |

Count: 3 High, 5 Medium, 2 Low (10 risks).

## Risks checked and not found
- **Hardcoded credentials:** a pattern search for `password`, `secret`, `api key` or `token` assignments in tracked files outside `dist/` and `external/` found one match, `event.secret = "boo!"` in `test/unit/event.js`, which is test data, not a credential. The search is limited to that pattern and is not a full secret scan.
- **Runtime dependencies:** none (`"dependencies": {}`), so no third-party runtime packages to patch apart from the bundled Sizzle.
- **Marked TODO/FIXME debt:** 0 TODO, 0 FIXME, 0 HACK, 2 XXX in `src/`.

## Prioritized actions
1. **(Risks 1-3)** Upgrade to a maintained jQuery version (NVD says the HTML-handling issues are patched in 3.5.0; confirm against the current upgrade guide) and use the jQuery Migrate plugin to find removed APIs. Until then: never pass untrusted strings to `$()`, `.html()` or `.append()`; do not deep-merge untrusted JSON; always set `dataType` on Ajax calls.
2. **(Risks 5, 6)** Inventory plugins and code using global `$`, `bind`/`delegate` and `Deferred`, and replace them with `on`/`off` and native Promises step by step, with tests.
3. **(Risks 7, 8)** Move the build and tests to a maintained toolchain only if you must rebuild jQuery; otherwise consume a released build and do not run the old dev toolchain in CI.
4. **(Risk 4)** Remove compatibility code only after fixing the minimum supported browsers.

## Method and limits
- Evidence comes from the source at the tag, `git`, `cloc`, NVD, jsdom validation runs (49 checks), `npm install`/`grunt`/`npm audit` run on Node.js v24.18.0 on 2026-11-09, and grep searches.
- Not done: the browser QUnit suite; a full secret scan; any penetration testing of a real application; verification of future jQuery behavior.
- Severity levels are judgments and could be ranked differently by another team.

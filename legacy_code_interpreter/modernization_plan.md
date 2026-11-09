# Modernization Plan - Applications that use jQuery 1.12.4

Scope: an application (or site) that currently ships jQuery 1.12.4 (tag `1.12.4`, released 2016-05-20). The plan is based on measurements and experiments in this directory: `codebase_overview.md`, `risk_assessment.md`, `ai_explanations.md`, `docs/` and `tests/`. Effort and duration figures are deliberately **not** estimated, because they depend on how much application code uses jQuery, which this repository cannot show.

## Goals
1. Remove the known security exposure (risks R1-R3 in `risk_assessment.md`).
2. Get onto a maintained jQuery release, then reduce jQuery use step by step.
3. Never lose behavior silently: every step is guarded by tests.

## Evidence used (all from this project)
- NVD lists four CVEs affecting this version range; the relevant code paths exist in 1.12.4.
- The 18 characterization tests (`tests/`) pass on 1.12.4. Run unchanged on **jQuery 3.7.1 and 4.0.0 they showed only four differences**: three about `Deferred` (async callbacks, no longer synchronous, exceptions no longer propagate to `resolve()`) and the prototype-pollution behavior, which is fixed. Extend, selectors, events, Ajax converters and DOM manipulation behaved the same in those tests.
- The 2015-era build toolchain still installs and runs on Node.js v24.18.0 but has 82 audited vulnerabilities (build-time only).
- Old-browser code: 80 `Support:` comments and 148 IE-related lines in 30 files.

## Strategies
| ID | Strategy | Why | Phases |
|---|---|---|---|
| S1 | **Safety net first:** characterization tests, an inventory of jQuery use, and short-term mitigations | You cannot change what you cannot verify; also closes the most urgent holes quickly | Short |
| S2 | **Upgrade the library in place** to a maintained release using the jQuery Migrate plugin | Removes R1-R3 with the least code change; experiment showed few behavior differences | Medium |
| S3 | **Strangler-style replacement of jQuery with native APIs**, one feature area at a time | Shrinks the dependency until jQuery can be removed or left as a minor plugin dependency | Medium to long |
| S4 | **Toolchain and delivery modernization** | Stops depending on a 2015 build stack and old CI settings | Long (only if you build jQuery yourself) |

## Phase 1 - Short term: stabilize and make changes safe (S1)
1. **Inventory.** List every page, script and plugin that loads jQuery; search the application code for `.html(`, `.append(`, `$.extend(true`, `$.ajax`, `$.Deferred`, `.bind(`, `.delegate(` and `$.parseJSON`. Output: a spreadsheet of call sites by risk.
2. **Run the characterization tests** (`tests/`) against the version in use; add application-specific tests for the top call sites (for example the forms and widgets users rely on most).
3. **Mitigate in place** (no upgrade yet):
   - never pass untrusted strings to `$()`, `.html()`, `.append()`; sanitize HTML with a vetted library or use `.text()`;
   - do not deep-merge untrusted JSON with `$.extend(true, ...)`; reject keys named `__proto__` before merging;
   - set `dataType` explicitly on every `$.ajax` call, especially cross-domain ones, so responses are never evaluated as scripts by accident;
   - add a Content-Security-Policy header to limit the impact of injected script.
4. **Pin and record** the exact jQuery file hash in the build so upgrades are deliberate.

Exit criteria: inventory complete; tests running in CI; mitigations merged.

## Phase 2 - Medium term: upgrade the library (S2)
1. Choose the target: the newest 3.x (3.7.1 was tested) or 4.0.0 (also tested), depending on the browsers you must support. Check the official upgrade guides for the chosen major version first; they were **not** reviewed in this project.
2. Load **jQuery Migrate** next to the new version in a test environment to log removed or changed APIs; fix each warning.
3. **Fix the known `Deferred` differences** found by the experiment: do not rely on synchronous callbacks; do not rely on exceptions propagating out of `then`; wrap with `Promise.resolve()` where native promises are wanted.
4. Replace deprecated calls (`bind`, `unbind`, `delegate`, `undelegate`) with `on` / `off`.
5. Run the characterization tests with `JQUERY_PATH` pointing at the new build; every difference must be explained and accepted (the four known ones are expected) or fixed.
6. Roll out behind a feature flag or to a small share of traffic first.

Exit criteria: all pages run on the new version with no Migrate warnings; CVEs R1-R3 no longer apply to the shipped version (verify against NVD for the chosen version).

## Phase 3 - Long term: shrink and retire jQuery (S3, S4)
1. **Strangler approach per feature area.** For each area, add a native implementation behind the same function name, switch call sites one module at a time, delete the jQuery usage when none remain.

   | jQuery area | Native replacement to consider |
   |---|---|
   | `$.ajax`, `$.get/post` | `fetch` plus `response.json()` |
   | `$.Deferred`, `$.when` | `Promise`, `Promise.all`, `async/await` |
   | `on` / `off` with delegation | `addEventListener` with `event.target.closest(selector)` |
   | `$(sel)`, `find`, `closest` | `querySelector(All)`, `closest` |
   | `$.extend` | `Object.assign`, `structuredClone`, or a prototype-safe merge helper |
   | `.html()`, `.append()` | DOM creation APIs with sanitized input |
   | effects (`animate`, `fadeIn`) | CSS transitions / Web Animations API |

2. **Drop old-browser support** once analytics show the minimum browsers; then remove polyfills and workaround branches in your own code.
3. **If you must rebuild jQuery** (custom builds), move the build to a maintained toolchain and pin dependencies; otherwise consume the released file and delete the old Grunt/Travis setup (S4).
4. **Delete jQuery** when nothing depends on it, or keep the slim build only for a plugin that cannot be replaced.

Exit criteria: no application code calls `$`/`jQuery`, or the remaining use is documented and tested.

## Risks of the plan and mitigations
| # | Risk | Likelihood / impact | Mitigation |
|---|------|---------------------|------------|
| P1 | A third-party plugin is unmaintained and breaks on the new jQuery | Medium / High | Inventory plugins in Phase 1; test each with Migrate; replace or fork-and-fix; keep the old version only for pages that need it until replaced |
| P2 | Hidden reliance on synchronous `Deferred` behavior causes subtle timing bugs | Medium / Medium | The characterization tests flag it; search for code reading results immediately after `resolve`; add tests for those flows |
| P3 | Behavior differences not covered by the 18 tests | Medium / Medium | Add application tests for top call sites before upgrading; compare screenshots / end-to-end tests of key flows |
| P4 | Removing browser-specific code breaks users on older browsers | Low / High | Check analytics and the support policy first; remove only after sign-off |
| P5 | Big-bang changes are hard to roll back | Medium / High | Small steps per area, feature flags, keep the previous file hash available for quick rollback |
| P6 | Migrate plugin left in production hides problems and adds weight | Low / Low | Use Migrate only in test/staging; remove it before release |
| P7 | Security mitigations in Phase 1 are incomplete | Medium / High | Treat Phase 1 as temporary; prioritize the upgrade in Phase 2; re-run the inventory search after each release |
| P8 | Effort runs over because usage is larger than expected | Medium / Medium | The Phase 1 inventory gives the real count before committing to dates |

## Success measures
- Number of call sites of risky APIs found in Phase 1 goes to zero (or to documented exceptions).
- jQuery version in production is a maintained release, confirmed against NVD.
- Characterization and application tests pass in CI on every change.
- Count of `$`/`jQuery` references in application code decreases each release.

## Limits of this plan
- It is generic for applications that use jQuery 1.12.4; it was not applied to a specific application.
- Only the behaviors covered by the 18 tests were compared across versions; the official upgrade guides and the upstream test suite were not reviewed or run here.

# jQuery 1.12.4 - Module Documentation

Generated from the real source tree of tag `1.12.4` (commit `f55d0ec8f28d648ac6429d03f1e2102d85912e86`) by `generate_docs.js`. Facts (files, line counts, dependencies, API names) come from the code; the one-paragraph purposes are written explanations. See `../codebase_overview.md` for measurements and `../ai_explanations.md` for deep dives into five complex functions.

## Module map
| Module | Files | Lines | Depends on | Used by |
|---|---|---|---|---|
| [entry](modules/entry.md) | 3 | 83 | ajax, attributes, callbacks, core, css, data, deferred, deprecated, dimensions, effects, event, exports, manipulation, offset, queue, selector, serialize, support, traversing, wrap | - |
| [core](modules/core.md) | 6 | 943 | deferred, manipulation, traversing, var | ajax, attributes, callbacks, css, data, deferred, deprecated, dimensions, effects, entry, event, exports, manipulation, offset, queue, selector, serialize, support, traversing, wrap |
| [selector](modules/selector.md) | 2 | 15 | core, sizzle (external) | ajax, attributes, css, effects, entry, event, manipulation, offset, traversing |
| [traversing](modules/traversing.md) | 5 | 320 | core, selector, var | ajax, core, deprecated, effects, entry, manipulation, serialize, wrap |
| [callbacks](modules/callbacks.md) | 1 | 232 | core, var | deferred, entry, queue |
| [deferred](modules/deferred.md) | 1 | 159 | callbacks, core, var | ajax, core, effects, entry, queue |
| [data](modules/data.md) | 3 | 385 | core, var | entry, event, manipulation |
| [queue](modules/queue.md) | 2 | 166 | callbacks, core, deferred, effects | effects, entry |
| [attributes](modules/attributes.md) | 6 | 883 | core, selector, var | entry, serialize |
| [event](modules/event.md) | 4 | 1207 | core, data, selector, var | ajax, entry, manipulation |
| [manipulation](modules/manipulation.md) | 13 | 954 | ajax, core, data, event, selector, traversing, var | ajax, core, css, entry, serialize, wrap |
| [css](modules/css.md) | 13 | 1183 | core, manipulation, selector, var | dimensions, effects, entry, offset |
| [effects](modules/effects.md) | 4 | 832 | core, css, deferred, queue, selector, traversing, var | entry, queue |
| [ajax](modules/ajax.md) | 10 | 1444 | core, deferred, event, manipulation, selector, traversing, var | entry, manipulation |
| [offset](modules/offset.md) | 1 | 219 | core, css, selector, var | entry |
| [dimensions](modules/dimensions.md) | 1 | 56 | core, css | entry |
| [serialize](modules/serialize.md) | 1 | 125 | attributes, core, manipulation, traversing | entry |
| [support](modules/support.md) | 1 | 63 | core, var | entry |
| [wrap](modules/wrap.md) | 1 | 77 | core, manipulation, traversing | entry |
| [deprecated](modules/deprecated.md) | 1 | 34 | core, traversing | entry |
| [exports](modules/exports.md) | 2 | 50 | core | entry |
| [var](modules/var.md) | 14 | 64 | - | ajax, attributes, callbacks, core, css, data, deferred, effects, event, manipulation, offset, support, traversing |

Total: 95 source files, 9494 lines (`wc`-style line counts, including comments and blanks).

## How the pieces fit
- `core` is the base; almost every other module depends on it. `selector` (Sizzle), `callbacks` and `data` are low-level services.
- `deferred` builds on `callbacks`; `ajax`, `effects` and `core` (document ready) use `deferred`.
- `event`, `manipulation`, `attributes`, `css` and `traversing` form the DOM-facing API.
- `exports` finally exposes the library as AMD module and global `jQuery`/`$`.

## Verification of the extracted API
- 158 extracted names were checked against the running library (jQuery 1.12.4 in jsdom): **0 missing**.

## Regenerate
```sh
git clone https://github.com/jquery/jquery.git && cd jquery && git checkout 1.12.4 && cd ..
cd legacy_code_interpreter/tests && npm install && cd ../docs
node generate_docs.js ../../../jquery
```

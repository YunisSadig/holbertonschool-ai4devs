# Module: callbacks

A small publish/subscribe list (`jQuery.Callbacks`) with flags such as `once`, `memory`, `unique` and `stopOnFalse`. Deferred and the event system build on it.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 1 |
| Total lines / non-blank lines | 232 / 195 |
| Depends on (other modules) | `core`, `var` |
| Used by | `deferred`, `entry`, `queue` |

## Files
- [`src/callbacks.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/callbacks.js) - 232 lines; imports `core`, `var/rnotwhite`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: `Callbacks`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

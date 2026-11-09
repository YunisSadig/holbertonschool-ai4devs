# Module: deferred

jQuery's own promise implementation (`jQuery.Deferred`, `jQuery.when`) built on Callbacks. Callbacks run synchronously and it is not Promises/A+ compliant (checked by tests in `../tests`).

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 1 |
| Total lines / non-blank lines | 159 / 134 |
| Depends on (other modules) | `callbacks`, `core`, `var` |
| Used by | `ajax`, `core`, `effects`, `entry`, `queue` |

## Files
- [`src/deferred.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/deferred.js) - 159 lines; imports `core`, `var/slice`, `callbacks`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: `Deferred`, `when`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

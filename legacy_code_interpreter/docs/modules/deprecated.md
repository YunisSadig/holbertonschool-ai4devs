# Module: deprecated

Backward-compatible aliases (`bind`, `unbind`, `delegate`, `undelegate`) implemented on top of `on`/`off`.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 1 |
| Total lines / non-blank lines | 34 / 27 |
| Depends on (other modules) | `core`, `traversing` |
| Used by | `entry` |

## Files
- [`src/deprecated.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/deprecated.js) - 34 lines; imports `core`, `traversing`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `andSelf`, `bind`, `delegate`, `size`, `unbind`, `undelegate`
- **Static functions (`jQuery.*`)**: _none extracted_

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

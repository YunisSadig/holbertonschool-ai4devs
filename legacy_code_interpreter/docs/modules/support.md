# Module: support

Feature detection results in `jQuery.support`, computed once at load; many branches elsewhere depend on them.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 1 |
| Total lines / non-blank lines | 63 / 50 |
| Depends on (other modules) | `core`, `var` |
| Used by | `entry` |

## Files
- [`src/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/support.js) - 63 lines; imports `core`, `var/support`, `var/document`, `core/init`, `core/ready`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: _none extracted_

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

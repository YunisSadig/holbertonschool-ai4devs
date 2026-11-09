# Module: exports

How the library is exposed: AMD registration (`amd.js`) and the global `jQuery`/`$` variables (`global.js`).

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 2 |
| Total lines / non-blank lines | 50 / 40 |
| Depends on (other modules) | `core` |
| Used by | `entry` |

## Files
- [`src/exports/amd.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/exports/amd.js) - 24 lines; imports `core`
- [`src/exports/global.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/exports/global.js) - 26 lines

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: `noConflict`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

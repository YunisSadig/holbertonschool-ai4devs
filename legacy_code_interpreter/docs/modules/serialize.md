# Module: serialize

Form serialization and URL parameter building: `jQuery.param`, `.serialize()`, `.serializeArray()`.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 1 |
| Total lines / non-blank lines | 125 / 101 |
| Depends on (other modules) | `attributes`, `core`, `manipulation`, `traversing` |
| Used by | `entry` |

## Files
- [`src/serialize.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/serialize.js) - 125 lines; imports `core`, `manipulation/var/rcheckableType`, `core/init`, `traversing`, `attributes/prop`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `serialize`, `serializeArray`
- **Static functions (`jQuery.*`)**: `param`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

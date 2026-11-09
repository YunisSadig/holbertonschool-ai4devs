# Module: selector

Connects jQuery to the vendored Sizzle selector engine, which finds elements by CSS selector (`jQuery.find`, `jQuery.expr`, `jQuery.unique`). In the 1.x branch Sizzle cannot be removed.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 2 |
| Total lines / non-blank lines | 15 / 13 |
| Depends on (other modules) | `core`, `sizzle (external)` |
| Used by | `ajax`, `attributes`, `css`, `effects`, `entry`, `event`, `manipulation`, `offset`, `traversing` |

## Files
- [`src/selector-sizzle.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/selector-sizzle.js) - 14 lines; imports `core`, `../external/sizzle/dist/sizzle`
- [`src/selector.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/selector.js) - 1 lines; imports `selector-sizzle`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: `contains`, `expr`, `find`, `isXMLDoc`, `text`, `uniqueSort`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

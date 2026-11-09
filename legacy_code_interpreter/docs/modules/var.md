# Module: var

Tiny shared helpers and constants used by many modules (array method references, regular expressions, `document`, `indexOf`).

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 14 |
| Total lines / non-blank lines | 64 / 60 |
| Depends on (other modules) | _none extracted_ |
| Used by | `ajax`, `attributes`, `callbacks`, `core`, `css`, `data`, `deferred`, `effects`, `event`, `manipulation`, `offset`, `support`, `traversing` |

## Files
- [`src/var/class2type.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/class2type.js) - 5 lines
- [`src/var/concat.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/concat.js) - 5 lines; imports `var/deletedIds`
- [`src/var/deletedIds.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/deletedIds.js) - 3 lines
- [`src/var/document.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/document.js) - 3 lines
- [`src/var/documentElement.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/documentElement.js) - 5 lines; imports `var/document`
- [`src/var/hasOwn.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/hasOwn.js) - 5 lines; imports `var/class2type`
- [`src/var/indexOf.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/indexOf.js) - 5 lines; imports `var/deletedIds`
- [`src/var/pnum.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/pnum.js) - 3 lines
- [`src/var/push.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/push.js) - 5 lines; imports `var/deletedIds`
- [`src/var/rcssNum.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/rcssNum.js) - 7 lines; imports `var/pnum`
- [`src/var/rnotwhite.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/rnotwhite.js) - 3 lines
- [`src/var/slice.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/slice.js) - 5 lines; imports `var/deletedIds`
- [`src/var/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/support.js) - 5 lines
- [`src/var/toString.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/var/toString.js) - 5 lines; imports `var/class2type`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: _none extracted_

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

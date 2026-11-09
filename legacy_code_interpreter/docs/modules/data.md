# Module: data

Per-element key/value storage (`jQuery.data`, `.data()`, `removeData`) used by events, effects and plugins. Includes the cache logic that avoids memory leaks on old browsers.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 3 |
| Total lines / non-blank lines | 385 / 305 |
| Depends on (other modules) | `core`, `var` |
| Used by | `entry`, `event`, `manipulation` |

## Files
- [`src/data.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/data.js) - 342 lines; imports `core`, `var/deletedIds`, `data/support`, `data/var/acceptData`
- [`src/data/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/data/support.js) - 23 lines; imports `var/document`, `var/support`
- [`src/data/var/acceptData.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/data/var/acceptData.js) - 20 lines; imports `core`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `data`, `removeData`
- **Static functions (`jQuery.*`)**: `_data`, `_removeData`, `cache`, `data`, `hasData`, `noData`, `removeData`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

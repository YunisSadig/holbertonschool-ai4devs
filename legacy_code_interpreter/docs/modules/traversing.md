# Module: traversing

Walks the DOM from the current set: `find`, `closest`, `parents`, `children`, `siblings`, `next`, `prev`, `filter`, `not`, `has`, `is`, `index`, `add`.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 5 |
| Total lines / non-blank lines | 320 / 269 |
| Depends on (other modules) | `core`, `selector`, `var` |
| Used by | `ajax`, `core`, `deprecated`, `effects`, `entry`, `manipulation`, `serialize`, `wrap` |

## Files
- [`src/traversing.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/traversing.js) - 179 lines; imports `core`, `traversing/var/dir`, `traversing/var/siblings`, `traversing/var/rneedsContext`, `core/init`, `traversing/findFilter`, `selector`
- [`src/traversing/findFilter.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/traversing/findFilter.js) - 100 lines; imports `core`, `var/indexOf`, `traversing/var/rneedsContext`, `selector`
- [`src/traversing/var/dir.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/traversing/var/dir.js) - 20 lines; imports `core`
- [`src/traversing/var/rneedsContext.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/traversing/var/rneedsContext.js) - 6 lines; imports `core`, `selector`
- [`src/traversing/var/siblings.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/traversing/var/siblings.js) - 15 lines

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `add`, `addBack`, `closest`, `filter`, `find`, `has`, `index`, `is`, `not`
- **Static functions (`jQuery.*`)**: `filter`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

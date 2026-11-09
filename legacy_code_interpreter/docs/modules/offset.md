# Module: offset

Element position relative to the document or offset parent: `offset`, `position`, `offsetParent`.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 1 |
| Total lines / non-blank lines | 219 / 184 |
| Depends on (other modules) | `core`, `css`, `selector`, `var` |
| Used by | `entry` |

## Files
- [`src/offset.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/offset.js) - 219 lines; imports `core`, `core/access`, `var/document`, `var/documentElement`, `css/var/rnumnonpx`, `css/curCSS`, `css/addGetHookIf`, `css/support`, `core/init`, `css`, `selector`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `offset`, `offsetParent`, `position`
- **Static functions (`jQuery.*`)**: `offset`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

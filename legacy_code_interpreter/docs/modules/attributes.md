# Module: attributes

Reading and writing attributes, properties, values and classes: `attr`, `prop`, `val`, `addClass`, `removeClass`, `toggleClass`, `hasClass`, with many browser-specific fixes.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 6 |
| Total lines / non-blank lines | 883 / 726 |
| Depends on (other modules) | `core`, `selector`, `var` |
| Used by | `entry`, `serialize` |

## Files
- [`src/attributes.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/attributes.js) - 11 lines; imports `core`, `attributes/val`, `attributes/attr`, `attributes/prop`, `attributes/classes`
- [`src/attributes/attr.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/attributes/attr.js) - 281 lines; imports `core`, `core/access`, `attributes/support`, `var/rnotwhite`, `attributes/val`, `selector`
- [`src/attributes/classes.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/attributes/classes.js) - 174 lines; imports `core`, `var/rnotwhite`, `core/init`
- [`src/attributes/prop.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/attributes/prop.js) - 156 lines; imports `core`, `core/access`, `attributes/support`, `selector`
- [`src/attributes/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/attributes/support.js) - 70 lines; imports `var/document`, `var/support`
- [`src/attributes/val.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/attributes/val.js) - 191 lines; imports `core`, `attributes/support`, `core/init`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `addClass`, `attr`, `hasClass`, `prop`, `removeAttr`, `removeClass`, `removeProp`, `toggleClass`, `val`
- **Static functions (`jQuery.*`)**: `attr`, `attrHooks`, `prop`, `propFix`, `propHooks`, `removeAttr`, `valHooks`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

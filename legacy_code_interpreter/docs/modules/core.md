# Module: core

The heart of the library: the `jQuery` function, the shared prototype `jQuery.fn`, `extend` (object merging), core utilities (`each`, `map`, `type`, `isPlainObject`, `globalEval`, `parseHTML`) and the document-ready logic. `core/init.js` implements what `$(...)` does with each kind of argument.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 6 |
| Total lines / non-blank lines | 943 / 744 |
| Depends on (other modules) | `deferred`, `manipulation`, `traversing`, `var` |
| Used by | `ajax`, `attributes`, `callbacks`, `css`, `data`, `deferred`, `deprecated`, `dimensions`, `effects`, `entry`, `event`, `exports`, `manipulation`, `offset`, `queue`, `selector`, `serialize`, `support`, `traversing`, `wrap` |

## Files
- [`src/core.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/core.js) - 529 lines; imports `var/deletedIds`, `var/document`, `var/slice`, `var/concat`, `var/push`, `var/indexOf`, `var/class2type`, `var/toString`, `var/hasOwn`, `var/support`
- [`src/core/access.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/core/access.js) - 65 lines; imports `core`
- [`src/core/init.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/core/init.js) - 140 lines; imports `core`, `var/document`, `core/var/rsingleTag`, `traversing/findFilter`
- [`src/core/parseHTML.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/core/parseHTML.js) - 41 lines; imports `core`, `var/document`, `core/var/rsingleTag`, `manipulation/buildFragment`
- [`src/core/ready.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/core/ready.js) - 163 lines; imports `core`, `var/document`, `core/init`, `deferred`
- [`src/core/var/rsingleTag.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/core/var/rsingleTag.js) - 5 lines

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `ready`
- **Static functions (`jQuery.*`)**: `camelCase`, `each`, `error`, `expando`, `extend`, `globalEval`, `grep`, `guid`, `holdReady`, `inArray`, `isArray`, `isEmptyObject`, `isFunction`, `isNumeric`, `isPlainObject`, `isReady`, `isWindow`, `makeArray`, `map`, `merge`, `nodeName`, `noop`, `now`, `parseHTML`, `proxy`, `ready`, `readyWait`, `support`, `trim`, `type`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

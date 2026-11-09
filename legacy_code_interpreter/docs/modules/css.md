# Module: css

Reading and writing styles: `css`, `show`/`hide`/`toggle`, computed style access and vendor-prefix handling.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 13 |
| Total lines / non-blank lines | 1183 / 965 |
| Depends on (other modules) | `core`, `manipulation`, `selector`, `var` |
| Used by | `dimensions`, `effects`, `entry`, `offset` |

## Files
- [`src/css.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css.js) - 563 lines; imports `core`, `var/pnum`, `core/access`, `css/var/rmargin`, `var/document`, `var/rcssNum`, `css/var/rnumnonpx`, `css/var/cssExpand`, `css/var/isHidden`, `css/var/swap`, `css/curCSS`, `css/adjustCSS`, `css/defaultDisplay`, `css/addGetHookIf`, `css/support`, `core/init`, `core/ready`, `selector`
- [`src/css/addGetHookIf.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/addGetHookIf.js) - 24 lines
- [`src/css/adjustCSS.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/adjustCSS.js) - 65 lines; imports `core`, `var/rcssNum`
- [`src/css/curCSS.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/curCSS.js) - 137 lines; imports `css/exports`, `core`, `var/documentElement`, `css/var/rnumnonpx`, `css/var/rmargin`, `css/support`, `selector`
- [`src/css/defaultDisplay.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/defaultDisplay.js) - 72 lines; imports `core`, `var/document`, `manipulation`
- [`src/css/hiddenVisibleSelectors.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/hiddenVisibleSelectors.js) - 42 lines; imports `core`, `var/document`, `css/support`, `selector`, `css`
- [`src/css/showHide.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/showHide.js) - 45 lines
- [`src/css/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/support.js) - 184 lines; imports `core`, `var/document`, `var/documentElement`, `var/support`
- [`src/css/var/cssExpand.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/var/cssExpand.js) - 3 lines
- [`src/css/var/isHidden.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/var/isHidden.js) - 16 lines; imports `core`, `selector`
- [`src/css/var/rmargin.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/var/rmargin.js) - 3 lines
- [`src/css/var/rnumnonpx.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/var/rnumnonpx.js) - 5 lines; imports `var/pnum`
- [`src/css/var/swap.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/css/var/swap.js) - 24 lines

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `css`, `hide`, `show`, `toggle`
- **Static functions (`jQuery.*`)**: `css`, `cssHooks`, `cssNumber`, `cssProps`, `style`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

# Module: effects

Animation: `animate`, `fadeIn`, `slideUp`, `stop`, easing functions and the timer that drives frames (`jQuery.fx`).

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 4 |
| Total lines / non-blank lines | 832 / 705 |
| Depends on (other modules) | `core`, `css`, `deferred`, `queue`, `selector`, `traversing`, `var` |
| Used by | `entry`, `queue` |

## Files
- [`src/effects.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/effects.js) - 640 lines; imports `core`, `effects/support`, `var/rcssNum`, `var/rnotwhite`, `css/var/cssExpand`, `css/var/isHidden`, `css/adjustCSS`, `css/defaultDisplay`, `var/document`, `core/init`, `effects/Tween`, `queue`, `css`, `deferred`, `traversing`
- [`src/effects/Tween.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/effects/Tween.js) - 121 lines; imports `core`, `css`
- [`src/effects/animatedSelector.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/effects/animatedSelector.js) - 13 lines; imports `core`, `selector`, `effects`
- [`src/effects/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/effects/support.js) - 58 lines; imports `var/support`, `var/document`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `animate`, `fadeTo`, `finish`, `stop`
- **Static functions (`jQuery.*`)**: `Animation`, `Tween`, `easing`, `fx`, `speed`, `timers`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

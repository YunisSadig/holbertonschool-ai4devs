# Module: entry

The build entry: `jquery.js` lists every module as an AMD dependency, and `intro.js` / `outro.js` wrap the concatenated output. It is why the build pulls in all modules; other modules do not depend on it.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 3 |
| Total lines / non-blank lines | 83 / 77 |
| Depends on (other modules) | `ajax`, `attributes`, `callbacks`, `core`, `css`, `data`, `deferred`, `deprecated`, `dimensions`, `effects`, `event`, `exports`, `manipulation`, `offset`, `queue`, `selector`, `serialize`, `support`, `traversing`, `wrap` |
| Used by | _none extracted_ |

## Files
- [`src/intro.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/intro.js) - 44 lines
- [`src/jquery.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/jquery.js) - 37 lines; imports `core`, `selector`, `traversing`, `callbacks`, `deferred`, `core/ready`, `support`, `data`, `queue`, `queue/delay`, `attributes`, `event`, `event/alias`, `manipulation`, `manipulation/_evalUrl`, `wrap`, `css`, `css/hiddenVisibleSelectors`, `serialize`, `ajax`, `ajax/xhr`, `ajax/script`, `ajax/jsonp`, `ajax/load`, `event/ajax`, `effects`, `effects/animatedSelector`, `offset`, `dimensions`, `deprecated`, `exports/amd`
- [`src/outro.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/outro.js) - 2 lines

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: _none extracted_
- **Static functions (`jQuery.*`)**: _none extracted_

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

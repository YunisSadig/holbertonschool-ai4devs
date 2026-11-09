# Module: manipulation

Creating and changing DOM content: `append`, `prepend`, `before`, `after`, `html`, `text`, `remove`, `empty`, `clone`, `replaceWith`, and `jQuery.htmlPrefilter` (relevant to public advisories).

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 13 |
| Total lines / non-blank lines | 954 / 773 |
| Depends on (other modules) | `ajax`, `core`, `data`, `event`, `selector`, `traversing`, `var` |
| Used by | `ajax`, `core`, `css`, `entry`, `serialize`, `wrap` |

## Files
- [`src/manipulation.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation.js) - 585 lines; imports `core`, `var/document`, `var/concat`, `var/push`, `var/deletedIds`, `core/access`, `manipulation/var/rcheckableType`, `manipulation/var/rtagName`, `manipulation/var/rscriptType`, `manipulation/var/rleadingWhitespace`, `manipulation/var/nodeNames`, `manipulation/createSafeFragment`, `manipulation/wrapMap`, `manipulation/getAll`, `manipulation/setGlobalEval`, `manipulation/buildFragment`, `manipulation/support`, `data/var/acceptData`, `core/init`, `traversing`, `selector`, `event`
- [`src/manipulation/_evalUrl.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/_evalUrl.js) - 21 lines; imports `ajax`
- [`src/manipulation/buildFragment.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/buildFragment.js) - 157 lines; imports `core`, `manipulation/var/rcheckableType`, `manipulation/var/rtagName`, `manipulation/var/rscriptType`, `manipulation/var/rleadingWhitespace`, `manipulation/createSafeFragment`, `manipulation/wrapMap`, `manipulation/getAll`, `manipulation/setGlobalEval`, `manipulation/support`
- [`src/manipulation/createSafeFragment.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/createSafeFragment.js) - 20 lines; imports `manipulation/var/nodeNames`
- [`src/manipulation/getAll.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/getAll.js) - 33 lines; imports `core`
- [`src/manipulation/setGlobalEval.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/setGlobalEval.js) - 19 lines; imports `core`
- [`src/manipulation/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/support.js) - 72 lines; imports `core`, `var/document`, `var/support`
- [`src/manipulation/var/nodeNames.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/var/nodeNames.js) - 5 lines
- [`src/manipulation/var/rcheckableType.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/var/rcheckableType.js) - 3 lines
- [`src/manipulation/var/rleadingWhitespace.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/var/rleadingWhitespace.js) - 3 lines
- [`src/manipulation/var/rscriptType.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/var/rscriptType.js) - 3 lines
- [`src/manipulation/var/rtagName.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/var/rtagName.js) - 3 lines
- [`src/manipulation/wrapMap.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/manipulation/wrapMap.js) - 30 lines; imports `manipulation/support`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `after`, `append`, `before`, `clone`, `detach`, `domManip`, `empty`, `html`, `prepend`, `remove`, `replaceWith`, `text`
- **Static functions (`jQuery.*`)**: `_evalUrl`, `cleanData`, `clone`, `htmlPrefilter`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

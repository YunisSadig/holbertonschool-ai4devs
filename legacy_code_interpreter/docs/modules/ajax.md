# Module: ajax

XMLHttpRequest wrapper: `jQuery.ajax`, shortcuts (`get`, `post`, `getJSON`, `getScript`), type conversion (`ajaxConvert`), prefilters and transports for XHR, script tags and JSONP.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 10 |
| Total lines / non-blank lines | 1444 / 1167 |
| Depends on (other modules) | `core`, `deferred`, `event`, `manipulation`, `selector`, `traversing`, `var` |
| Used by | `entry`, `manipulation` |

## Files
- [`src/ajax.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax.js) - 842 lines; imports `core`, `var/document`, `var/rnotwhite`, `ajax/var/location`, `ajax/var/nonce`, `ajax/var/rquery`, `core/init`, `ajax/parseJSON`, `ajax/parseXML`, `deferred`
- [`src/ajax/jsonp.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/jsonp.js) - 100 lines; imports `core`, `ajax/var/nonce`, `ajax/var/rquery`, `ajax`
- [`src/ajax/load.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/load.js) - 83 lines; imports `core`, `core/parseHTML`, `ajax`, `traversing`, `manipulation`, `selector`, `event/alias`
- [`src/ajax/parseJSON.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/parseJSON.js) - 53 lines; imports `core`
- [`src/ajax/parseXML.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/parseXML.js) - 31 lines; imports `core`
- [`src/ajax/script.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/script.js) - 95 lines; imports `core`, `var/document`, `ajax`
- [`src/ajax/var/location.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/var/location.js) - 3 lines
- [`src/ajax/var/nonce.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/var/nonce.js) - 5 lines; imports `core`
- [`src/ajax/var/rquery.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/var/rquery.js) - 3 lines
- [`src/ajax/xhr.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/ajax/xhr.js) - 229 lines; imports `core`, `var/document`, `var/support`, `ajax`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `load`
- **Static functions (`jQuery.*`)**: `active`, `ajax`, `ajaxPrefilter`, `ajaxSettings`, `ajaxSetup`, `ajaxTransport`, `etag`, `getJSON`, `getScript`, `lastModified`, `parseJSON`, `parseXML`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

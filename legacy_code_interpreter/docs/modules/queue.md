# Module: queue

Ordered function queues per element (`jQuery.queue`, `.queue()`, `.dequeue()`, `.delay()`), used mainly by animations.

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 2 |
| Total lines / non-blank lines | 166 / 142 |
| Depends on (other modules) | `callbacks`, `core`, `deferred`, `effects` |
| Used by | `effects`, `entry` |

## Files
- [`src/queue.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/queue.js) - 144 lines; imports `core`, `deferred`, `callbacks`
- [`src/queue/delay.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/queue/delay.js) - 22 lines; imports `core`, `queue`, `effects`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `clearQueue`, `delay`, `dequeue`, `promise`, `queue`
- **Static functions (`jQuery.*`)**: `_queueHooks`, `dequeue`, `queue`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

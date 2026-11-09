# Module: event

Event binding, delegation and triggering (`on`, `off`, `one`, `trigger`, `jQuery.Event`). One native listener per element dispatches to jQuery handlers (`jQuery.event.dispatch`).

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | 4 |
| Total lines / non-blank lines | 1207 / 992 |
| Depends on (other modules) | `core`, `data`, `selector`, `var` |
| Used by | `ajax`, `entry`, `manipulation` |

## Files
- [`src/event.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/event.js) - 1134 lines; imports `core`, `var/document`, `var/rnotwhite`, `var/hasOwn`, `var/slice`, `event/support`, `data/var/acceptData`, `core/init`, `data`, `selector`
- [`src/event/ajax.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/event/ajax.js) - 20 lines; imports `core`, `event`
- [`src/event/alias.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/event/alias.js) - 25 lines; imports `core`, `event`
- [`src/event/support.js`](https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/event/support.js) - 28 lines; imports `var/document`, `var/support`

## Public API found by static extraction
- **Instance methods (`jQuery.fn`)**: `hover`, `off`, `on`, `one`, `trigger`, `triggerHandler`
- **Static functions (`jQuery.*`)**: `Event`, `event`, `removeEvent`

_Extraction looks for `jQuery.fn.extend({ ... })`, `jQuery.extend({ ... })` blocks and direct assignments. Methods created in loops (for example the `width`/`height` family or shorthand event methods) are not listed here._

'use strict';
/**
 * Generates docs/README.md and docs/modules/*.md for jQuery 1.12.4 from the real source tree.
 *
 * Facts (files, line counts, AMD dependencies, public API names) are EXTRACTED from the source.
 * The one-paragraph purpose of each module is written text (AI-assisted, human-checkable) kept in SUMMARIES below.
 * Extracted API names are cross-checked against the running library (tests/vendor/jquery-1.12.4.js in jsdom).
 *
 * Usage (from this docs folder):
 *   node generate_docs.js <path-to-jquery-1.12.4-checkout> [path-to-built-jquery.js]
 */
const fs = require('fs');
const path = require('path');

const SRC_ROOT = path.resolve(process.argv[2] || '.');
const SRC = path.join(SRC_ROOT, 'src');
const BUILT = path.resolve(process.argv[3] || path.join(__dirname, '..', 'tests', 'vendor', 'jquery-1.12.4.js'));
const OUT = __dirname;

const SUMMARIES = {
  core: 'The heart of the library: the `jQuery` function, the shared prototype `jQuery.fn`, `extend` (object merging), core utilities (`each`, `map`, `type`, `isPlainObject`, `globalEval`, `parseHTML`) and the document-ready logic. `core/init.js` implements what `$(...)` does with each kind of argument.',
  selector: 'Connects jQuery to the vendored Sizzle selector engine, which finds elements by CSS selector (`jQuery.find`, `jQuery.expr`, `jQuery.unique`). In the 1.x branch Sizzle cannot be removed.',
  traversing: 'Walks the DOM from the current set: `find`, `closest`, `parents`, `children`, `siblings`, `next`, `prev`, `filter`, `not`, `has`, `is`, `index`, `add`.',
  callbacks: 'A small publish/subscribe list (`jQuery.Callbacks`) with flags such as `once`, `memory`, `unique` and `stopOnFalse`. Deferred and the event system build on it.',
  deferred: 'jQuery\'s own promise implementation (`jQuery.Deferred`, `jQuery.when`) built on Callbacks. Callbacks run synchronously and it is not Promises/A+ compliant (checked by tests in `../tests`).',
  data: 'Per-element key/value storage (`jQuery.data`, `.data()`, `removeData`) used by events, effects and plugins. Includes the cache logic that avoids memory leaks on old browsers.',
  queue: 'Ordered function queues per element (`jQuery.queue`, `.queue()`, `.dequeue()`, `.delay()`), used mainly by animations.',
  attributes: 'Reading and writing attributes, properties, values and classes: `attr`, `prop`, `val`, `addClass`, `removeClass`, `toggleClass`, `hasClass`, with many browser-specific fixes.',
  event: 'Event binding, delegation and triggering (`on`, `off`, `one`, `trigger`, `jQuery.Event`). One native listener per element dispatches to jQuery handlers (`jQuery.event.dispatch`).',
  manipulation: 'Creating and changing DOM content: `append`, `prepend`, `before`, `after`, `html`, `text`, `remove`, `empty`, `clone`, `replaceWith`, and `jQuery.htmlPrefilter` (relevant to public advisories).',
  css: 'Reading and writing styles: `css`, `show`/`hide`/`toggle`, computed style access and vendor-prefix handling.',
  effects: 'Animation: `animate`, `fadeIn`, `slideUp`, `stop`, easing functions and the timer that drives frames (`jQuery.fx`).',
  ajax: 'XMLHttpRequest wrapper: `jQuery.ajax`, shortcuts (`get`, `post`, `getJSON`, `getScript`), type conversion (`ajaxConvert`), prefilters and transports for XHR, script tags and JSONP.',
  offset: 'Element position relative to the document or offset parent: `offset`, `position`, `offsetParent`.',
  dimensions: 'Element sizes: `width`, `height`, `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`.',
  serialize: 'Form serialization and URL parameter building: `jQuery.param`, `.serialize()`, `.serializeArray()`.',
  support: 'Feature detection results in `jQuery.support`, computed once at load; many branches elsewhere depend on them.',
  wrap: 'Wrapping elements: `wrap`, `wrapAll`, `wrapInner`, `unwrap`.',
  deprecated: 'Backward-compatible aliases (`bind`, `unbind`, `delegate`, `undelegate`) implemented on top of `on`/`off`.',
  exports: 'How the library is exposed: AMD registration (`amd.js`) and the global `jQuery`/`$` variables (`global.js`).',
  entry: 'The build entry: `jquery.js` lists every module as an AMD dependency, and `intro.js` / `outro.js` wrap the concatenated output. It is why the build pulls in all modules; other modules do not depend on it.',
  'sizzle (external)': 'The vendored Sizzle selector engine (`external/sizzle`), imported by `selector-sizzle.js`; it is not part of `src/`.',
  var: 'Tiny shared helpers and constants used by many modules (array method references, regular expressions, `document`, `indexOf`).'
};
const ORDER = ['entry', 'core', 'selector', 'traversing', 'callbacks', 'deferred', 'data', 'queue', 'attributes', 'event', 'manipulation', 'css', 'effects', 'ajax', 'offset', 'dimensions', 'serialize', 'support', 'wrap', 'deprecated', 'exports', 'var'];

function listFiles(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) out.push(...listFiles(p));
    else if (f.name.endsWith('.js')) out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(SRC, p).split(path.sep).join('/');
const files = listFiles(SRC).map(rel).sort();
const unitOf = (f) => {
  const top = f.split('/')[0].replace(/\.js$/, '');
  if (top === 'selector-sizzle') return 'selector';
  if (['intro', 'outro', 'jquery'].includes(top)) return 'entry';
  if (top === '..') return 'sizzle (external)';
  return top;
};

// ---- extract per-file facts --------------------------------------------------------
const info = {};
for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  let deps = [];
  const m = /define\(\s*\[([\s\S]*?)\]\s*,\s*function/.exec(text);
  if (m) {
    deps = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => path.posix.normalize(path.posix.join(path.posix.dirname(f), x[1])) + '.js');
  }
  const api = { fn: [], util: [] };
  // blocks: jQuery.fn.extend( { ... } ) and jQuery.extend( { ... } )
  for (const kind of ['fn', 'util']) {
    const startRe = kind === 'fn' ? /^jQuery\.fn\.extend\( \{/ : /^jQuery\.extend\( \{/;
    for (let i = 0; i < lines.length; i++) {
      if (startRe.test(lines[i])) {
        for (let j = i + 1; j < lines.length && !/^\} \);/.test(lines[j]); j++) {
          const k = /^\t(\w+): /.exec(lines[j]);
          if (k) api[kind].push(k[1]);
        }
      }
    }
  }
  for (const l of lines) {
    let k = /^jQuery\.fn\.(\w+) = /.exec(l); if (k) api.fn.push(k[1]);
    k = /^jQuery\.(\w+) = /.exec(l); if (k && k[1] !== 'fn') api.util.push(k[1]);
  }
  info[f] = { lines: lines.length - (text.endsWith('\n') ? 1 : 0), nonBlank: lines.filter((l) => l.trim() !== '').length, deps, api, amd: !!m };
}

// ---- unit level aggregation ---------------------------------------------------------
const units = {};
for (const f of files) {
  const u = unitOf(f);
  units[u] = units[u] || { files: [], lines: 0, nonBlank: 0, deps: new Set(), fn: [], util: [] };
  units[u].files.push(f);
  units[u].lines += info[f].lines;
  units[u].nonBlank += info[f].nonBlank;
  info[f].deps.forEach((d) => { const du = unitOf(d); if (du !== u) units[u].deps.add(du); });
  units[u].fn.push(...info[f].api.fn);
  units[u].util.push(...info[f].api.util);
}
const usedBy = {};
for (const [u, v] of Object.entries(units)) for (const d of v.deps) (usedBy[d] = usedBy[d] || new Set()).add(u);

// ---- cross-check extracted API names against the running library --------------------------------
let crossCheck = { checked: 0, missing: [], skipped: 'built file not found' };
try {
  const { JSDOM } = require('module').createRequire(path.join(__dirname, '..', 'tests', 'package.json'))('jsdom');
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync(BUILT, 'utf8'));
  const $ = dom.window.jQuery;
  crossCheck = { checked: 0, missing: [], version: $.fn.jquery };
  for (const v of Object.values(units)) {
    for (const n of new Set(v.fn)) { crossCheck.checked++; if (typeof $.fn[n] !== 'function' && !(n in $.fn)) crossCheck.missing.push('$.fn.' + n); }
    for (const n of new Set(v.util)) { crossCheck.checked++; if (!(n in $)) crossCheck.missing.push('$.' + n); }
  }
} catch (e) { crossCheck.skipped = String(e.message).split('\n')[0]; }

// ---- write docs ---------------------------------------------------------------------------
const fm = (arr) => arr.length ? arr.map((x) => '`' + x + '`').join(', ') : '_none extracted_';
const uniq = (a) => [...new Set(a)].sort();
const GH = 'https://github.com/jquery/jquery/blob/f55d0ec8f28d648ac6429d03f1e2102d85912e86/src/';
fs.mkdirSync(path.join(OUT, 'modules'), { recursive: true });

const names = [...ORDER.filter((u) => units[u]), ...Object.keys(units).filter((u) => !ORDER.includes(u) && !u.startsWith('sizzle')).sort()];
for (const u of names) {
  const v = units[u];
  const md = `# Module: ${u}

${SUMMARIES[u] || ''}

## Facts extracted from the source (jQuery 1.12.4)
| Item | Value |
|---|---|
| Source files | ${v.files.length} |
| Total lines / non-blank lines | ${v.lines} / ${v.nonBlank} |
| Depends on (other modules) | ${fm([...v.deps].sort())} |
| Used by | ${fm([...(usedBy[u] || [])].sort())} |

## Files
${v.files.map((f) => `- [\`src/${f}\`](${GH}${f}) - ${info[f].lines} lines${info[f].deps.length ? '; imports ' + info[f].deps.map((d) => '`' + d.replace(/\.js$/, '') + '`').join(', ') : ''}`).join('\n')}

## Public API found by static extraction
- **Instance methods (\`jQuery.fn\`)**: ${fm(uniq(v.fn))}
- **Static functions (\`jQuery.*\`)**: ${fm(uniq(v.util))}

_Extraction looks for \`jQuery.fn.extend({ ... })\`, \`jQuery.extend({ ... })\` blocks and direct assignments. Methods created in loops (for example the \`width\`/\`height\` family or shorthand event methods) are not listed here._
`;
  fs.writeFileSync(path.join(OUT, 'modules', u + '.md'), md);
}

const total = names.reduce((s, u) => s + units[u].lines, 0);
const readme = `# jQuery 1.12.4 - Module Documentation

Generated from the real source tree of tag \`1.12.4\` (commit \`f55d0ec8f28d648ac6429d03f1e2102d85912e86\`) by \`generate_docs.js\`. Facts (files, line counts, dependencies, API names) come from the code; the one-paragraph purposes are written explanations. See \`../codebase_overview.md\` for measurements and \`../ai_explanations.md\` for deep dives into five complex functions.

## Module map
| Module | Files | Lines | Depends on | Used by |
|---|---|---|---|---|
${names.map((u) => `| [${u}](modules/${u}.md) | ${units[u].files.length} | ${units[u].lines} | ${[...units[u].deps].sort().join(', ') || '-'} | ${[...(usedBy[u] || [])].sort().join(', ') || '-'} |`).join('\n')}

Total: ${files.length} source files, ${total} lines (\`wc\`-style line counts, including comments and blanks).

## How the pieces fit
- \`core\` is the base; almost every other module depends on it. \`selector\` (Sizzle), \`callbacks\` and \`data\` are low-level services.
- \`deferred\` builds on \`callbacks\`; \`ajax\`, \`effects\` and \`core\` (document ready) use \`deferred\`.
- \`event\`, \`manipulation\`, \`attributes\`, \`css\` and \`traversing\` form the DOM-facing API.
- \`exports\` finally exposes the library as AMD module and global \`jQuery\`/\`$\`.

## Verification of the extracted API
${crossCheck.skipped ? '- Not run: ' + crossCheck.skipped : `- ${crossCheck.checked} extracted names were checked against the running library (jQuery ${crossCheck.version} in jsdom): **${crossCheck.missing.length} missing**${crossCheck.missing.length ? ' (' + crossCheck.missing.join(', ') + ')' : ''}.`}

## Regenerate
\`\`\`sh
git clone https://github.com/jquery/jquery.git && cd jquery && git checkout 1.12.4 && cd ..
cd legacy_code_interpreter/tests && npm install && cd ../docs
node generate_docs.js ../../../jquery
\`\`\`
`;
fs.writeFileSync(path.join(OUT, 'README.md'), readme);
console.log(JSON.stringify({ modules: names.length, files: files.length, totalLines: total, crossCheck }, null, 1));

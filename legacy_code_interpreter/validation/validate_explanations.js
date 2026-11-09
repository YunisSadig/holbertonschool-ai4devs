// Validates claims made in ai_explanations.md by running jQuery 1.12.4 (dist/jquery.js) in jsdom.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const jqPath = process.argv[2];
const dom = new JSDOM('<!doctype html><html><body><div id="outer"><ul id="list"><li class="item" id="a">A</li><li class="item" id="b">B</li></ul><button id="btn">go</button></div></body></html>', { url: 'http://localhost/', runScripts: 'outside-only' });
dom.window.eval(fs.readFileSync(jqPath, 'utf8'));
const $ = dom.window.jQuery;
const results = [];
const check = (name, ok, detail) => { results.push({ name, ok: !!ok, detail: detail === undefined ? '' : String(detail) }); };

// --- Section 1: jQuery.extend ---
check('version is 1.12.4', $.fn.jquery === '1.12.4', $.fn.jquery);
let a = { x: { y: 1 }, arr: [1, 2] }, b = { x: { z: 2 }, arr: [3] };
let shallow = $.extend({}, a, b);
check('shallow extend replaces nested object', JSON.stringify(shallow.x) === '{"z":2}', JSON.stringify(shallow.x));
let deep = $.extend(true, {}, a, b);
check('deep extend merges nested objects', JSON.stringify(deep.x) === '{"y":1,"z":2}', JSON.stringify(deep.x));
check('deep extend merges arrays by index', JSON.stringify(deep.arr) === '[3,2]', JSON.stringify(deep.arr));
check('deep extend clones (does not alias) nested source objects', deep.x !== b.x && (() => { const t = $.extend(true, {}, { o: { k: 1 } }); const s = { o: { k: 1 } }; const r = $.extend(true, {}, s); return r.o !== s.o; })());
check('undefined values are skipped', !('u' in $.extend({}, { u: undefined })), '');
check('null/undefined sources are ignored', JSON.stringify($.extend({ p: 1 }, null, undefined)) === '{"p":1}', '');
const self = {}; self.me = self;
check('target === copy loop guard (no infinite loop for self reference)', (() => { try { $.extend(true, self, self); return true; } catch (e) { return false; } })(), '');
const host = $.extend({ extra: 1 });
check('single argument extends jQuery itself', $.extra === 1, $.extra);
delete $.extra;
// --- Section 2: jQuery.fn.init ---
check('$("") returns empty set', $('').length === 0);
check('$(null) returns empty set', $(null).length === 0);
check('$("#a") finds by id', $('#a').length === 1 && $('#a')[0].id === 'a');
check('$("#a").selector is "#a"', $('#a').selector === '#a', $('#a').selector);
check('$(html) creates elements', (() => { const e = $('<p class="n">hi</p>'); return e.length === 1 && e[0].nodeName === 'P'; })());
check('$(html, props) calls methods/attrs', (() => { const e = $('<input>', { type: 'text', val: 'v', 'data-q': 'z' }); return e.val() === 'v' && e.attr('type') === 'text' && e.attr('data-q') === 'z'; })());
check('$(expr, context) equals $(context).find(expr)', $('.item', '#list').length === 2 && $('#list').find('.item').length === 2);
check('$("<div") (not ending with >) is treated as a selector, not HTML', (() => { try { $('<div'); return false; } catch (e) { return /Syntax error|unrecognized expression/i.test(e.message); } })());
check('$(DOMElement) wraps element', $(dom.window.document.body).length === 1);
check('$.fn.init.prototype === $.fn', $.fn.init.prototype === $.fn);

// --- Section 3: event dispatch / delegation ---
const order = [];
const $list = $('#list');
$('#a').on('click', function () { order.push('direct-a'); });
$list.on('click', '.item', function () { order.push('delegated-item'); });
$list.on('click', function () { order.push('direct-list'); });
$('#a').trigger('click');
check('delegated handlers run before handlers bound directly on the delegation root', order.indexOf('delegated-item') < order.indexOf('direct-list'), order.join(','));
check('element-level direct handler runs first at its own element', order[0] === 'direct-a', order.join(','));
let stopOrder = [];
$list.off('click');
$list.on('click', '.item', function (e) { stopOrder.push('d1'); e.stopImmediatePropagation(); });
$list.on('click', '.item', function () { stopOrder.push('d2'); });
$('#b').trigger('click');
check('stopImmediatePropagation prevents later handlers', stopOrder.join(',') === 'd1', stopOrder.join(','));
let ret = [];
$('#btn').on('click', function () { return false; });
$('#outer').on('click', function () { ret.push('outer'); });
$('#btn').trigger('click');
check('returning false stops propagation (outer handler not run)', ret.length === 0, ret.join(','));
const nsCalls = [];
$('#btn').off('click');
$('#btn').on('click.alpha', function () { nsCalls.push('alpha'); }).on('click.beta', function () { nsCalls.push('beta'); });
$('#btn').trigger('click.alpha');
check('namespaced trigger runs only matching handlers', nsCalls.join(',') === 'alpha', nsCalls.join(','));
const dis = dom.window.document.createElement('button'); dis.id = 'dis'; dis.disabled = true; dom.window.document.body.appendChild(dis);
let disCalls = 0;
$(dom.window.document.body).on('click', '#dis', function () { disCalls++; });
dis.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
check('delegated click on a disabled element is ignored', disCalls === 0, disCalls);

// --- Section 4: Deferred.then ---
const log = [];
const d = $.Deferred();
const chained = d.then(function (v) { log.push('then1:' + v); return v + 1; }).then(function (v) { log.push('then2:' + v); return v * 2; });
d.resolve(1);
let finalValue; chained.done(function (v) { finalValue = v; });
check('then() returns a new promise whose value is the callback result', finalValue === 4 && log.join(',') === 'then1:1,then2:2', finalValue + ' | ' + log.join(','));
check('then() returns a promise (no resolve method)', typeof chained.resolve === 'undefined' && typeof chained.done === 'function');
check('pipe is the same function as then (back-compat)', (() => { const p = $.Deferred().promise(); return p.pipe === p.then; })());
const d2 = $.Deferred(); const inner = $.Deferred(); let adopted;
d2.then(function () { return inner.promise(); }).done(function (v) { adopted = v; });
d2.resolve(); inner.resolve('inner-value');
check('returned promise is adopted by the chain', adopted === 'inner-value', adopted);
const d3 = $.Deferred(); let rejectedSeen = 0, doneSeen = 0;
d3.then(function () { doneSeen++; }, undefined).fail(function () { rejectedSeen++; });
d3.reject();
check('rejection passes through then() when no fail handler is given', rejectedSeen === 1 && doneSeen === 0);
const d4 = $.Deferred();
d4.then(function () { throw new Error('boom'); }).fail(function () { });
let threw = false; try { d4.resolve(); } catch (e) { threw = /boom/.test(e.message); }
check('exceptions in then() callbacks are NOT converted to rejections (they propagate)', threw, threw);
check('state transitions: pending -> resolved', (() => { const x = $.Deferred(); const s0 = x.state(); x.resolve(); return s0 === 'pending' && x.state() === 'resolved'; })());
check('resolved deferred cannot be rejected afterwards', (() => { const x = $.Deferred(); x.resolve(); x.reject(); return x.state() === 'resolved'; })());
check('done callbacks added after resolution still fire (memory)', (() => { const x = $.Deferred().resolve(5); let v; x.done(function (a) { v = a; }); return v === 5; })());

// --- Section 5: ajaxConvert via a generic fake transport (no network) ---
let nextText = '{"a":1}';
$.ajaxTransport("+*", function () { return { send: function (h, complete) { complete(200, 'OK', { text: nextText }, 'Content-Type: text/plain'); }, abort: function () { } }; });
let converted;
$.ajax({ url: '/x', dataType: 'json', async: false }).done(function (d) { converted = d; });
check('"text json" converter turns the response text into an object', converted && converted.a === 1, JSON.stringify(converted));
let customErr;
$.ajax({ url: '/x', dataType: 'json', async: false, converters: { 'text json': function () { throw new Error('bad'); } } }).fail(function (xhr, status) { customErr = status; });
check('converter exception yields "parsererror" (throws option is false)', customErr === 'parsererror', customErr);
let filterArgs;
$.ajax({ url: '/x', dataType: 'json', async: false, dataFilter: function (data, type) { filterArgs = [data, type]; return data; } });
check('dataFilter receives raw text and the dataType', filterArgs && filterArgs[0] === '{"a":1}' && filterArgs[1] === 'json', JSON.stringify(filterArgs));
nextText = 'window.__ran = (window.__ran || 0) + 1;';
$.ajax({ url: '/x', dataType: 'script', async: false });
check('"text script" converter evaluates the response as code (globalEval)', dom.window.__ran === 1, dom.window.__ran);
nextText = '{"a":1}';
let chainRes;
$.ajax({ url: '/x', dataType: 'text json', async: false }).done(function (d) { chainRes = d; });
check('multiple dataTypes ("text json") chain conversions in order', chainRes && chainRes.a === 1, JSON.stringify(chainRes));
let customChain;
$.ajax({ url: '/x', dataType: 'up', async: false, converters: { 'text up': function (t) { return t.toUpperCase(); } } }).done(function (d) { customChain = d; });
check('custom converter "text up" is found by the "prev current" lookup', customChain === '{"A":1}', customChain);
let twoStep;
$.ajax({ url: '/x', dataType: 'wrapped', async: false, converters: { 'text json': $.parseJSON, 'json wrapped': function (o) { return { wrapped: o }; } } }).done(function (d) { twoStep = d; });
check('two-step conversion text -> json -> wrapped uses an intermediate type', twoStep && twoStep.wrapped && twoStep.wrapped.a === 1, JSON.stringify(twoStep));



// --- Extra checks used by the explanations ---
check('$(" <b>x</b>trailing") parses the HTML and ignores text after the last ">"', (() => { const e = $(' <b>x</b>trailing'); return e.length === 1 && e[0].nodeName === 'B'; })());
check('$("<img>") creates an element from an arbitrary HTML string', $('<img>')[0].nodeName === 'IMG');
check('Deferred callbacks run synchronously (before then() returns)', (() => { let ran = false; $.Deferred().resolve(1).then(function () { ran = true; }); return ran; })());
check('a returned native Promise is NOT adopted by then() (no .promise function): it becomes the value', (() => { const x = $.Deferred(); let got; x.then(function () { return dom.window.Promise.resolve(5); }).done(function (v) { got = v; }); x.resolve(); return got instanceof dom.window.Promise; })());
check('ajax with an unknown dataType and no converter fails with "No conversion from text to nope"', (() => { let msg; $.ajax({ url: '/x', dataType: 'nope', async: false }).fail(function (x, st, err) { msg = st + '|' + err; }); return /parsererror|No conversion from text to nope/.test(msg || ''); })());

// --- Prototype pollution probe in its OWN window (it deliberately pollutes Object.prototype) ---
{
  const d2 = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost/', runScripts: 'outside-only' });
  d2.window.eval(fs.readFileSync(jqPath, 'utf8'));
  const j2 = d2.window.jQuery;
  const target = d2.window.eval('({})');
  const payload = d2.window.JSON.parse('{"__proto__":{"polluted_by_extend":"yes"}}');
  j2.extend(true, target, payload);
  check('deep extend pollutes Object.prototype via an own "__proto__" key (CVE-2019-11358 pattern)', d2.window.eval('({}).polluted_by_extend') === 'yes', d2.window.eval('({}).polluted_by_extend'));
  let brokeLater = false;
  try { j2.ajax({ url: '/x', async: false, transport: 0 }); } catch (e) { brokeLater = /is not a function/.test(e.message); }
  check('after pollution, jQuery\x27s own for...in loops break (jqXHR[i] is not a function)', brokeLater, brokeLater);
  const shallow = d2.window.eval('({})');
  j2.extend(shallow, d2.window.JSON.parse('{"__proto__":{"x":1}}'));
  check('non-deep extend of the same payload does not pollute Object.prototype', d2.window.eval('({}).x') === undefined, d2.window.eval('({}).x'));
}

const pass = results.filter(r => r.ok).length;
console.log(JSON.stringify({ total: results.length, passed: pass, failed: results.length - pass }));
for (const r of results) console.log((r.ok ? 'PASS ' : 'FAIL ') + r.name + (r.detail ? '  [' + r.detail + ']' : ''));
process.exit(pass === results.length ? 0 : 1);

'use strict';
/**
 * Characterization tests for jQuery 1.12.4.
 *
 * They pin down what the legacy library actually does today (including quirks), so
 * that a migration can be checked against them. Run them against another jQuery
 * build with:   JQUERY_PATH=/path/to/jquery.js node --test
 *
 * Run (from this folder):  npm install && npm test
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const JQUERY_PATH = process.env.JQUERY_PATH || path.join(__dirname, 'vendor', 'jquery-1.12.4.js');
const JQUERY_SOURCE = fs.readFileSync(JQUERY_PATH, 'utf8');

const HTML = '<!doctype html><html><body><div id="outer"><ul id="list">' +
  '<li class="item" id="a">A</li><li class="item" id="b">B</li></ul><button id="btn">go</button></div></body></html>';

/**
 * Fresh window with jQuery loaded, so tests cannot affect each other.
 * runScripts is "dangerously" because newer jQuery versions evaluate script text by
 * injecting a <script> element, which jsdom only runs in this mode. The page itself is static HTML.
 */
function load() {
  const dom = new JSDOM(HTML, { url: 'http://localhost/', runScripts: 'dangerously' });
  dom.window.eval(JQUERY_SOURCE);
  return { $: dom.window.jQuery, window: dom.window, dom };
}

test('loaded library is the version under test', () => {
  const { $ } = load();
  const expected = process.env.JQUERY_EXPECT_VERSION || '1.12.4';
  assert.strictEqual($.fn.jquery, expected);
});

// ---- 1. jQuery.extend --------------------------------------------------------------
test('extend: shallow copy replaces nested objects, deep copy merges them', () => {
  const { $ } = load();
  const a = { x: { y: 1 } };
  const b = { x: { z: 2 } };
  assert.deepStrictEqual(JSON.parse(JSON.stringify($.extend({}, a, b).x)), { z: 2 });
  assert.deepStrictEqual(JSON.parse(JSON.stringify($.extend(true, {}, a, b).x)), { y: 1, z: 2 });
});

test('extend: arrays are merged by index in a deep copy', () => {
  const { $ } = load();
  const r = $.extend(true, {}, { arr: [1, 2] }, { arr: [3] });
  assert.deepStrictEqual(Array.from(r.arr), [3, 2]);
});

test('extend: undefined values and null sources are skipped; nested sources are cloned', () => {
  const { $ } = load();
  assert.ok(!('u' in $.extend({}, { u: undefined })));
  assert.deepStrictEqual(JSON.parse(JSON.stringify($.extend({ p: 1 }, null, undefined))), { p: 1 });
  const src = { o: { k: 1 } };
  const out = $.extend(true, {}, src);
  assert.notStrictEqual(out.o, src.o);
});

// ---- 2. jQuery.fn.init ------------------------------------------------------------
test('init: falsy values give an empty set; #id and html strings are recognised', () => {
  const { $ } = load();
  assert.strictEqual($('').length, 0);
  assert.strictEqual($(null).length, 0);
  assert.strictEqual($('#a')[0].id, 'a');
  assert.strictEqual($('<p class="n">hi</p>')[0].nodeName, 'P');
  assert.strictEqual($('.item', '#list').length, 2);
});

test('init: $(html, props) sets methods and attributes on the new element', () => {
  const { $ } = load();
  const e = $('<input>', { type: 'text', val: 'v', 'data-q': 'z' });
  assert.strictEqual(e.val(), 'v');
  assert.strictEqual(e.attr('type'), 'text');
  assert.strictEqual(e.attr('data-q'), 'z');
});

// ---- 3. Events ------------------------------------------------------------------
test('events: delegated handlers run before handlers bound on the delegation root', () => {
  const { $ } = load();
  const order = [];
  $('#a').on('click', () => order.push('direct-a'));
  $('#list').on('click', '.item', () => order.push('delegated'));
  $('#list').on('click', () => order.push('root'));
  $('#a').trigger('click');
  assert.deepStrictEqual(order, ['direct-a', 'delegated', 'root']);
});

test('events: stopImmediatePropagation, return false and namespaces', () => {
  const { $ } = load();
  const seen = [];
  $('#list').on('click', '.item', (e) => { seen.push('d1'); e.stopImmediatePropagation(); });
  $('#list').on('click', '.item', () => seen.push('d2'));
  $('#b').trigger('click');
  assert.deepStrictEqual(seen, ['d1']);

  const outer = [];
  $('#btn').on('click', () => false);
  $('#outer').on('click', () => outer.push('outer'));
  $('#btn').trigger('click');
  assert.deepStrictEqual(outer, []);

  const ns = [];
  $('#btn').off('click');
  $('#btn').on('click.alpha', () => ns.push('alpha')).on('click.beta', () => ns.push('beta'));
  $('#btn').trigger('click.alpha');
  assert.deepStrictEqual(ns, ['alpha']);
});

// ---- 4. Deferred (legacy semantics) --------------------------------------------------
test('deferred: values flow through chained then() calls and a returned deferred is adopted', () => {
  const { $ } = load();
  const d = $.Deferred();
  let final;
  d.then((v) => v + 1).then((v) => v * 2).done((v) => { final = v; });
  d.resolve(1);
  assert.strictEqual(final, 4);

  const d2 = $.Deferred();
  const inner = $.Deferred();
  let adopted;
  d2.then(() => inner.promise()).done((v) => { adopted = v; });
  d2.resolve();
  inner.resolve('inner');
  assert.strictEqual(adopted, 'inner');
});

test('deferred: legacy 1.x behavior - callbacks are synchronous', () => {
  const { $ } = load();
  let ran = false;
  $.Deferred().resolve(1).then(() => { ran = true; });
  assert.strictEqual(ran, true, 'a native Promise would run this callback later (asynchronously)');
});

test('deferred: legacy 1.x behavior - an exception in a then callback propagates to resolve()', () => {
  const { $ } = load();
  const d = $.Deferred();
  d.then(() => { throw new Error('boom'); });
  assert.throws(() => d.resolve(), /boom/);
});

// ---- 5. Ajax converters (no network: in-memory transport) -------------------------------
function withFakeTransport() {
  const ctx = load();
  ctx.response = { text: '{"a":1}' };
  ctx.$.ajaxTransport('+*', () => ({
    send: (headers, complete) => complete(200, 'OK', { text: ctx.response.text }, 'Content-Type: text/plain'),
    abort: () => { }
  }));
  return ctx;
}

test('ajax: "text json" conversion, dataFilter and parsererror on a failing converter', () => {
  const { $ } = withFakeTransport();
  let data;
  $.ajax({ url: '/x', dataType: 'json', async: false }).done((d) => { data = d; });
  assert.strictEqual(data.a, 1);

  let filterArgs;
  $.ajax({ url: '/x', dataType: 'json', async: false, dataFilter: (d, t) => { filterArgs = [d, t]; return d; } });
  assert.deepStrictEqual(filterArgs, ['{"a":1}', 'json']);

  let status;
  $.ajax({ url: '/x', dataType: 'json', async: false, converters: { 'text json': () => { throw new Error('bad'); } } })
    .fail((x, s) => { status = s; });
  assert.strictEqual(status, 'parsererror');
});

test('ajax: custom converters, including a two-step route through an intermediate type', () => {
  const { $ } = withFakeTransport();
  let up;
  $.ajax({ url: '/x', dataType: 'up', async: false, converters: { 'text up': (t) => t.toUpperCase() } }).done((d) => { up = d; });
  assert.strictEqual(up, '{"A":1}');

  let wrapped;
  $.ajax({
    url: '/x', dataType: 'wrapped', async: false,
    converters: { 'text json': $.parseJSON, 'json wrapped': (o) => ({ wrapped: o }) }
  }).done((d) => { wrapped = d; });
  assert.strictEqual(wrapped.wrapped.a, 1);
});

test('ajax: the "script" dataType evaluates the response as code (why it is a security risk)', () => {
  const ctx = withFakeTransport();
  ctx.response.text = 'window.__ran = (window.__ran || 0) + 1;';
  ctx.$.ajax({ url: '/x', dataType: 'script', async: false });
  assert.strictEqual(ctx.window.__ran, 1);
});

// ---- 6. Other modules ----------------------------------------------------------------
test('callbacks: "once memory" flags fire once and replay to late subscribers', () => {
  const { $ } = load();
  const cb = $.Callbacks('once memory');
  const calls = [];
  cb.add((v) => calls.push('early:' + v));
  cb.fire(1);
  cb.fire(2);
  cb.add((v) => calls.push('late:' + v));
  assert.deepStrictEqual(calls, ['early:1', 'late:1']);
});

test('data: jQuery.data stores values per element, and attr/prop/class helpers work', () => {
  const { $ } = load();
  const $a = $('#a');
  $a.data('k', { n: 1 });
  assert.deepStrictEqual(JSON.parse(JSON.stringify($a.data('k'))), { n: 1 });
  $a.addClass('hot').attr('title', 't');
  assert.ok($a.hasClass('hot'));
  assert.strictEqual($a.attr('title'), 't');
  $a.removeClass('hot');
  assert.ok(!$a.hasClass('hot'));
});

test('traversing and manipulation: find, parents, append and html', () => {
  const { $ } = load();
  assert.strictEqual($('#list').find('li').length, 2);
  assert.strictEqual($('#a').parents('#outer').length, 1);
  $('#list').append('<li class="item" id="c">C</li>');
  assert.strictEqual($('.item').length, 3);
  assert.strictEqual($('#c').text(), 'C');
  $('#c').remove();
  assert.strictEqual($('.item').length, 2);
});

// ---- 7. Known weakness (kept as a documented behavior of 1.12.4) --------------------------
test('security: deep extend of a "__proto__" key pollutes Object.prototype in 1.12.4 (CVE-2019-11358)', () => {
  const { $, window } = load();
  const target = window.eval('({})');
  $.extend(true, target, window.JSON.parse('{"__proto__":{"polluted_by_extend":"yes"}}'));
  const polluted = window.eval('({}).polluted_by_extend');
  assert.strictEqual(polluted, 'yes', 'expected only on versions without the fix; a fixed jQuery leaves this undefined');
});

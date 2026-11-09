'use strict';
// Shared-fixture tests for the JavaScript implementation.
// Run from multi_language_code_generator/:  node --test tests/javascript/log_analyzer.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const FIXTURES = path.join(ROOT, 'tests', 'fixtures');
const IMPL = path.join(ROOT, 'implementations', 'javascript', 'log_analyzer.js');
const { analyze, toCanonicalJson, roundRate, isValidIp } = require(IMPL);

const names = fs.readdirSync(FIXTURES).filter((f) => f.endsWith('.log')).map((f) => f.slice(0, -4)).sort();

test('at least twelve shared cases', () => {
  assert.ok(names.length >= 12);
});

for (const name of names) {
  const log = path.join(FIXTURES, `${name}.log`);
  const expected = fs.readFileSync(path.join(FIXTURES, `${name}.expected.json`));

  test(`api output matches expected bytes: ${name}`, () => {
    const text = new TextDecoder('utf-8').decode(fs.readFileSync(log));
    assert.deepStrictEqual(Buffer.from(toCanonicalJson(analyze(text)), 'utf8'), expected);
  });

  test(`cli output matches expected bytes: ${name}`, () => {
    const res = spawnSync(process.execPath, [IMPL, log]);
    assert.strictEqual(res.status, 0);
    assert.deepStrictEqual(res.stdout, expected);
  });
}

test('unreadable file gives non-zero exit and no stdout', () => {
  const res = spawnSync(process.execPath, [IMPL, path.join(os.tmpdir(), 'no_such_log_file.log')]);
  assert.notStrictEqual(res.status, 0);
  assert.strictEqual(res.stdout.length, 0);
});

test('rounding is half up and whole numbers print as integers', () => {
  assert.strictEqual(roundRate(1, 32), 0.0313);
  assert.strictEqual(roundRate(2, 3), 0.6667);
  assert.strictEqual(roundRate(0, 0), 0);
  assert.ok(toCanonicalJson(analyze('')).includes('"error_rate": 0,'));
});

test('ip validation', () => {
  assert.ok(isValidIp('255.255.255.255'));
  assert.ok(!isValidIp('256.0.0.1'));
  assert.ok(!isValidIp('1.2.3'));
});

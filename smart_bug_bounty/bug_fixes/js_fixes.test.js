'use strict';
// Tests asserting the INTENDED behaviour, run against bug3_fixed.js and bug4_fixed.js.
// Expected to PASS against the fixed versions. Run: node --test "bug_fixes/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const { orderTotal } = require('./bug3_fixed.js');
const { rankPlayers, topScore } = require('./bug4_fixed.js');

test('bug3_fixed: orderTotal sums resolved prices', async () => {
  assert.equal(await orderTotal(['apple', 'pear', 'plum']), 12);
});

test('bug3_fixed: orderTotal of no items is 0', async () => {
  assert.equal(await orderTotal([]), 0);
});

const players = [
  { name: 'ana', score: 5 },
  { name: 'bob', score: 10 },
  { name: 'cy', score: 1 },
];

test('bug4_fixed: rankPlayers sorts numerically, highest first', () => {
  assert.deepEqual(rankPlayers(players).map((p) => p.name), ['bob', 'ana', 'cy']);
});

test('bug4_fixed: topScore returns a number', () => {
  assert.equal(topScore(players), 10);
});

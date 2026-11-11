'use strict';
// Tests asserting the INTENDED behaviour of bug3.js and bug4.js.
// Expected to FAIL against the buggy originals. Run: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const { orderTotal } = require('../bug_snippets/bug3.js');
const { rankPlayers, topScore } = require('../bug_snippets/bug4.js');

test('bug3: orderTotal sums resolved prices', async () => {
  assert.equal(await orderTotal(['apple', 'pear', 'plum']), 12);
});

test('bug3: orderTotal of no items is 0', async () => {
  assert.equal(await orderTotal([]), 0);
});

const players = [
  { name: 'ana', score: 5 },
  { name: 'bob', score: 10 },
  { name: 'cy', score: 1 },
];

test('bug4: rankPlayers sorts numerically, highest first', () => {
  assert.deepEqual(rankPlayers(players).map((p) => p.name), ['bob', 'ana', 'cy']);
});

test('bug4: topScore returns a number', () => {
  assert.equal(topScore(players), 10);
});

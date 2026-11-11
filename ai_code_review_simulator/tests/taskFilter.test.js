'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { filterTasks } = require('../src/taskFilter');

const tasks = [
  { id: 1, title: 'Write report', description: 'Quarterly numbers', completed: false, priority: 'high', dueDate: '2025-03-10' },
  { id: 2, title: 'Fix login bug', description: 'Users cannot sign in', completed: true, priority: 'high', dueDate: '2025-02-01' },
  { id: 3, title: 'Buy milk', completed: false, priority: 'low', dueDate: null },
  { id: 4, title: 'Plan sprint', description: 'Report on velocity', completed: false, priority: 'medium', dueDate: '2025-03-15T09:00:00Z' },
];
const ids = (list) => list.map((t) => t.id);

test('returns all tasks (as a copy) when no filters are given', () => {
  const out = filterTasks(tasks);
  assert.deepEqual(ids(out), [1, 2, 3, 4]);
  assert.notEqual(out, tasks);
});

test('filters by completion status', () => {
  assert.deepEqual(ids(filterTasks(tasks, { completed: true })), [2]);
  assert.deepEqual(ids(filterTasks(tasks, { completed: false })), [1, 3, 4]);
});

test('treats a missing completed field as not completed', () => {
  assert.deepEqual(ids(filterTasks([{ id: 9, title: 'x', priority: 'low' }], { completed: false })), [9]);
});

test('filters by a single priority and by a list of priorities', () => {
  assert.deepEqual(ids(filterTasks(tasks, { priority: 'high' })), [1, 2]);
  assert.deepEqual(ids(filterTasks(tasks, { priority: ['low', 'medium'] })), [3, 4]);
});

test('filters by due date range (inclusive) and excludes tasks without a due date', () => {
  assert.deepEqual(ids(filterTasks(tasks, { dueBefore: '2025-03-10' })), [1, 2]);
  assert.deepEqual(ids(filterTasks(tasks, { dueAfter: '2025-03-10' })), [1, 4]);
  assert.deepEqual(ids(filterTasks(tasks, { dueAfter: '2025-02-15', dueBefore: '2025-03-12' })), [1]);
});

test('accepts Date objects as bounds', () => {
  assert.deepEqual(ids(filterTasks(tasks, { dueBefore: new Date('2025-02-01') })), [2]);
});

test('search is case-insensitive and checks title and description', () => {
  assert.deepEqual(ids(filterTasks(tasks, { search: 'REPORT' })), [1, 4]);
  assert.deepEqual(ids(filterTasks(tasks, { search: 'sign in' })), [2]);
});

test('search requires every keyword to match', () => {
  assert.deepEqual(ids(filterTasks(tasks, { search: 'report quarterly' })), [1]);
  assert.deepEqual(ids(filterTasks(tasks, { search: 'report milk' })), []);
});

test('blank search is ignored', () => {
  assert.equal(filterTasks(tasks, { search: '   ' }).length, 4);
});

test('combines multiple filters', () => {
  assert.deepEqual(ids(filterTasks(tasks, { completed: false, priority: 'high', search: 'report' })), [1]);
});

test('sorts by due date with undated tasks last', () => {
  assert.deepEqual(ids(filterTasks(tasks, { sortBy: 'dueDate' })), [2, 1, 4, 3]);
});

test('sorts by priority (high first, stable) and by title', () => {
  assert.deepEqual(ids(filterTasks(tasks, { sortBy: 'priority' })), [1, 2, 4, 3]);
  assert.deepEqual(ids(filterTasks(tasks, { sortBy: 'title' })), [3, 2, 4, 1]);
});

test('does not mutate the input array', () => {
  const copy = JSON.parse(JSON.stringify(tasks));
  filterTasks(tasks, { sortBy: 'title' });
  assert.deepEqual(tasks, copy);
});

test('returns an empty array for an empty task list', () => {
  assert.deepEqual(filterTasks([], { completed: true }), []);
});

test('rejects invalid task input', () => {
  assert.throws(() => filterTasks(null), TypeError);
  assert.throws(() => filterTasks('tasks'), TypeError);
  assert.throws(() => filterTasks([1]), /index 0/);
  assert.throws(() => filterTasks([null]), TypeError);
});

test('rejects invalid filters', () => {
  assert.throws(() => filterTasks(tasks, 'x'), TypeError);
  assert.throws(() => filterTasks(tasks, { completed: 'yes' }), TypeError);
  assert.throws(() => filterTasks(tasks, { priority: 'urgent' }), RangeError);
  assert.throws(() => filterTasks(tasks, { priority: [] }), RangeError);
  assert.throws(() => filterTasks(tasks, { search: 42 }), TypeError);
  assert.throws(() => filterTasks(tasks, { sortBy: 'id' }), RangeError);
  assert.throws(() => filterTasks(tasks, { colour: 'red' }), /unknown filter/);
});

test('rejects invalid or inconsistent dates', () => {
  assert.throws(() => filterTasks(tasks, { dueBefore: 'tomorrow' }), TypeError);
  assert.throws(() => filterTasks(tasks, { dueBefore: '2025-02-31' }), TypeError);
  assert.throws(() => filterTasks(tasks, { dueBefore: new Date('nope') }), TypeError);
  assert.throws(() => filterTasks(tasks, { dueAfter: '2025-04-01', dueBefore: '2025-03-01' }), RangeError);
});

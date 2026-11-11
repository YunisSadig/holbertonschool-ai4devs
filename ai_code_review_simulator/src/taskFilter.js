'use strict';

/**
 * Task filtering and search utility.
 *
 * A task is a plain object:
 *   { id, title, description?, completed, priority, dueDate? }
 * where priority is "low" | "medium" | "high" and dueDate is an ISO date
 * string (YYYY-MM-DD or a full ISO timestamp) or null/undefined.
 */

const PRIORITIES = Object.freeze(['low', 'medium', 'high']);
const PRIORITY_RANK = Object.freeze({ low: 0, medium: 1, high: 2 });
const KNOWN_FILTERS = Object.freeze([
  'completed',
  'priority',
  'dueBefore',
  'dueAfter',
  'search',
  'sortBy',
]);
const SORT_KEYS = Object.freeze(['dueDate', 'priority', 'title']);

/**
 * Parse a date-like value into a timestamp. Returns NaN when invalid.
 * Only Date instances and ISO-8601 strings are accepted.
 */
function toTimestamp(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/.test(value)) {
    const ts = Date.parse(value);
    // Reject overflow dates such as 2024-02-31 that Date.parse may roll over.
    if (!Number.isNaN(ts) && value.length === 10) {
      const [y, m, d] = value.split('-').map(Number);
      const check = new Date(Date.UTC(y, m - 1, d));
      if (check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return NaN;
    }
    return ts;
  }
  return NaN;
}

function assertTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array');
  }
  tasks.forEach((task, index) => {
    if (task === null || typeof task !== 'object' || Array.isArray(task)) {
      throw new TypeError(`task at index ${index} must be an object`);
    }
  });
}

/**
 * Validate and normalise the filter options. Throws on invalid input so that
 * callers never get silently-empty results caused by a typo.
 */
function normaliseFilters(filters) {
  if (filters === undefined || filters === null) return {};
  if (typeof filters !== 'object' || Array.isArray(filters)) {
    throw new TypeError('filters must be an object');
  }

  const unknown = Object.keys(filters).filter((key) => !KNOWN_FILTERS.includes(key));
  if (unknown.length > 0) {
    throw new RangeError(`unknown filter(s): ${unknown.join(', ')}`);
  }

  const out = {};

  if (filters.completed !== undefined) {
    if (typeof filters.completed !== 'boolean') {
      throw new TypeError('completed must be a boolean');
    }
    out.completed = filters.completed;
  }

  if (filters.priority !== undefined) {
    const list = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
    const invalid = list.filter((p) => !PRIORITIES.includes(p));
    if (list.length === 0 || invalid.length > 0) {
      throw new RangeError(`priority must be one or more of: ${PRIORITIES.join(', ')}`);
    }
    out.priority = new Set(list);
  }

  for (const key of ['dueBefore', 'dueAfter']) {
    if (filters[key] !== undefined) {
      const ts = toTimestamp(filters[key]);
      if (Number.isNaN(ts)) {
        throw new TypeError(`${key} must be a valid ISO date (YYYY-MM-DD) or Date`);
      }
      out[key] = ts;
    }
  }
  if (out.dueBefore !== undefined && out.dueAfter !== undefined && out.dueAfter > out.dueBefore) {
    throw new RangeError('dueAfter must not be later than dueBefore');
  }

  if (filters.search !== undefined) {
    if (typeof filters.search !== 'string') {
      throw new TypeError('search must be a string');
    }
    // Every whitespace-separated keyword must match (AND semantics).
    out.keywords = filters.search.toLowerCase().split(/\s+/).filter(Boolean);
  }

  if (filters.sortBy !== undefined) {
    if (!SORT_KEYS.includes(filters.sortBy)) {
      throw new RangeError(`sortBy must be one of: ${SORT_KEYS.join(', ')}`);
    }
    out.sortBy = filters.sortBy;
  }

  return out;
}

function matches(task, f) {
  if (f.completed !== undefined && Boolean(task.completed) !== f.completed) return false;
  if (f.priority && !f.priority.has(task.priority)) return false;

  if (f.dueBefore !== undefined || f.dueAfter !== undefined) {
    const due = toTimestamp(task.dueDate);
    // Tasks without a valid due date never satisfy a date-range filter.
    if (Number.isNaN(due)) return false;
    if (f.dueBefore !== undefined && due > f.dueBefore) return false;
    if (f.dueAfter !== undefined && due < f.dueAfter) return false;
  }

  if (f.keywords && f.keywords.length > 0) {
    const haystack = `${task.title || ''} ${task.description || ''}`.toLowerCase();
    if (!f.keywords.every((word) => haystack.includes(word))) return false;
  }
  return true;
}

function compare(sortBy) {
  switch (sortBy) {
    case 'dueDate':
      // Tasks with no (or invalid) due date sort last.
      return (a, b) => {
        const x = toTimestamp(a.dueDate);
        const y = toTimestamp(b.dueDate);
        if (Number.isNaN(x) && Number.isNaN(y)) return 0;
        if (Number.isNaN(x)) return 1;
        if (Number.isNaN(y)) return -1;
        return x - y;
      };
    case 'priority':
      // Highest priority first.
      return (a, b) => (PRIORITY_RANK[b.priority] ?? -1) - (PRIORITY_RANK[a.priority] ?? -1);
    case 'title':
      return (a, b) => String(a.title || '').localeCompare(String(b.title || ''));
    default:
      return null;
  }
}

/**
 * Filter (and optionally sort) tasks. Never mutates the input array.
 *
 * @param {Array<object>} tasks
 * @param {object} [filters]
 * @param {boolean} [filters.completed]
 * @param {string|string[]} [filters.priority]
 * @param {string|Date} [filters.dueBefore]  inclusive upper bound
 * @param {string|Date} [filters.dueAfter]   inclusive lower bound
 * @param {string} [filters.search]          case-insensitive, all words must match
 * @param {'dueDate'|'priority'|'title'} [filters.sortBy]
 * @returns {Array<object>} a new array; matching order is stable
 */
function filterTasks(tasks, filters) {
  assertTasks(tasks);
  const f = normaliseFilters(filters);
  const result = tasks.filter((task) => matches(task, f));
  const cmp = compare(f.sortBy);
  return cmp ? result.sort(cmp) : result;
}

module.exports = { filterTasks, PRIORITIES };

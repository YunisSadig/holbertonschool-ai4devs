'use strict';
// JavaScript (Node.js) translation of the Log Analyzer in ../../cross_language_spec.md.
// Usage: node log_analyzer.js <logfile>
const fs = require('node:fs');

// \S in JavaScript is Unicode-aware; the spec is ASCII, so spell the class out.
const NS = '[^ \\t\\n\\r\\f\\v]';
const LINE_RE = new RegExp(
  `^(${NS}+) ${NS}+ ${NS}+ \\[(\\d{2}/[A-Z][a-z]{2}/\\d{4}:\\d{2}:\\d{2}:\\d{2} [+-]\\d{4})\\] ` +
    `"([A-Z]+) (${NS}+) (HTTP/\\d\\.\\d)" (\\d{3}) (\\d+|-)$`
);
const BLANK_RE = /^[ \t]*$/;
const IP_FIELD_RE = /^\d{1,3}$/;

function isValidIp(ip) {
  const parts = ip.split('.');
  return parts.length === 4 && parts.every((p) => IP_FIELD_RE.test(p) && Number(p) <= 255);
}

function ipCompare(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

function roundRate(errorCount, validRequests) {
  if (validRequests === 0) return 0;
  // Integer arithmetic, round half up to 4 decimals (spec section 7).
  const scaled = Math.floor((errorCount * 20000 + validRequests) / (2 * validRequests));
  return scaled / 10000;
}

function parseLine(line) {
  const m = LINE_RE.exec(line);
  if (!m) return { error: 'bad_format' };
  if (!isValidIp(m[1])) return { error: 'invalid_ip' };
  const status = Number(m[6]);
  if (status < 100 || status > 599) return { error: 'invalid_status' };
  return { ip: m[1], method: m[3], status, bytes: m[7] === '-' ? 0 : Number(m[7]) };
}

class Aggregator {
  constructor() {
    this.total = 0;
    this.valid = 0;
    this.reasons = { bad_format: 0, invalid_ip: 0, invalid_status: 0 };
    this.ips = new Map();
    this.statuses = new Map();
    this.methods = new Map();
    this.totalBytes = 0;
  }

  feed(line) {
    if (line.endsWith('\r')) line = line.slice(0, -1);
    if (BLANK_RE.test(line)) return;
    this.total++;
    const rec = parseLine(line);
    if (rec.error) {
      this.reasons[rec.error]++;
      return;
    }
    this.valid++;
    this.ips.set(rec.ip, (this.ips.get(rec.ip) || 0) + 1);
    this.statuses.set(rec.status, (this.statuses.get(rec.status) || 0) + 1);
    this.methods.set(rec.method, (this.methods.get(rec.method) || 0) + 1);
    this.totalBytes += rec.bytes;
  }

  result() {
    const classes = { '1xx': 0, '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 };
    for (const [code, count] of this.statuses) classes[`${Math.floor(code / 100)}xx`] += count;
    const errorCount = classes['4xx'] + classes['5xx'];
    const statusDistribution = {};
    for (const code of [...this.statuses.keys()].sort((a, b) => a - b)) {
      statusDistribution[String(code)] = this.statuses.get(code);
    }
    const methods = {};
    for (const m of [...this.methods.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
      methods[m] = this.methods.get(m);
    }
    const top = [...this.ips.entries()]
      .sort((a, b) => b[1] - a[1] || ipCompare(a[0], b[0]))
      .slice(0, 3)
      .map(([ip, count]) => ({ ip, count }));
    return {
      total_lines: this.total,
      valid_requests: this.valid,
      malformed_lines: this.total - this.valid,
      malformed_reasons: { ...this.reasons },
      unique_ips: this.ips.size,
      status_distribution: statusDistribution,
      status_class_distribution: classes,
      error_count: errorCount,
      error_rate: roundRate(errorCount, this.valid),
      total_bytes: this.totalBytes,
      top_ips: top,
      methods,
    };
  }
}

function analyze(text) {
  const agg = new Aggregator();
  for (const piece of text.split('\n')) agg.feed(piece);
  return agg.result();
}

function toCanonicalJson(result) {
  return JSON.stringify(result, null, 2) + '\n';
}

function main(argv) {
  if (argv.length !== 1) {
    process.stderr.write('usage: node log_analyzer.js <logfile>\n');
    return 2;
  }
  const agg = new Aggregator();
  let fd;
  try {
    fd = fs.openSync(argv[0], 'r');
    const decoder = new TextDecoder('utf-8'); // replaces invalid bytes with U+FFFD
    const buf = Buffer.alloc(1 << 20);
    let carry = '';
    let n;
    while ((n = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
      const chunk = carry + decoder.decode(buf.subarray(0, n), { stream: true });
      const pieces = chunk.split('\n');
      carry = pieces.pop();
      for (const p of pieces) agg.feed(p);
    }
    carry += decoder.decode();
    if (carry !== '') agg.feed(carry);
  } catch (err) {
    process.stderr.write(`cannot read ${argv[0]}: ${err.message}\n`);
    return 1;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  process.stdout.write(toCanonicalJson(agg.result()));
  return 0;
}

module.exports = { analyze, parseLine, Aggregator, roundRate, isValidIp, toCanonicalJson };

if (require.main === module) process.exitCode = main(process.argv.slice(2));

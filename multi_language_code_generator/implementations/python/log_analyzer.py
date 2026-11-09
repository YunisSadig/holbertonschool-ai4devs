"""Reference implementation (Python 3) of the Log Analyzer defined in
../cross_language_spec.md. Standard library only.

Usage:  python log_analyzer.py <logfile>

The analyzer is streaming: lines are fed one at a time into an Aggregator, so
memory grows only with the number of distinct IP addresses.
"""
import json
import re
import sys
from typing import Any, Dict, List, Optional

LINE_RE = re.compile(
    r'(\S+) \S+ \S+ \[(\d{2}/[A-Z][a-z]{2}/\d{4}:\d{2}:\d{2}:\d{2} [+-]\d{4})\] '
    r'"([A-Z]+) (\S+) (HTTP/\d\.\d)" (\d{3}) (\d+|-)',
    re.ASCII,
)
BLANK_RE = re.compile(r'[ \t]*', re.ASCII)
IP_FIELD_RE = re.compile(r'\d{1,3}', re.ASCII)


def is_valid_ip(ip: str) -> bool:
    """Four dot-separated decimal fields, each 1-3 digits with value 0-255."""
    parts = ip.split('.')
    return len(parts) == 4 and all(
        IP_FIELD_RE.fullmatch(p) and int(p) <= 255 for p in parts
    )


def ip_sort_key(ip: str):
    return tuple(int(p) for p in ip.split('.'))


def round_rate(error_count: int, valid_requests: int):
    """Round-half-up to 4 decimals using integer arithmetic (spec section 7)."""
    if valid_requests == 0:
        return 0
    scaled = (error_count * 20000 + valid_requests) // (2 * valid_requests)
    return _canonical_number(scaled / 10000)


def _canonical_number(x: float):
    """Whole numbers are emitted as ints so text output matches other languages."""
    return int(x) if x == int(x) else x


def parse_line(line: str) -> Dict[str, Any]:
    """Return a record dict for a valid line, or {'error': reason}."""
    m = LINE_RE.fullmatch(line)
    if not m:
        return {'error': 'bad_format'}
    ip = m.group(1)
    if not is_valid_ip(ip):
        return {'error': 'invalid_ip'}
    status = int(m.group(6))
    if status < 100 or status > 599:
        return {'error': 'invalid_status'}
    raw_bytes = m.group(7)
    return {
        'ip': ip,
        'method': m.group(3),
        'status': status,
        'bytes': 0 if raw_bytes == '-' else int(raw_bytes),
    }


class Aggregator:
    """Accumulates statistics one line at a time."""

    def __init__(self) -> None:
        self.total = 0
        self.valid = 0
        self.reasons = {'bad_format': 0, 'invalid_ip': 0, 'invalid_status': 0}
        self.ips: Dict[str, int] = {}
        self.statuses: Dict[int, int] = {}
        self.methods: Dict[str, int] = {}
        self.total_bytes = 0

    def feed(self, line: str) -> None:
        if line.endswith('\r'):
            line = line[:-1]
        if BLANK_RE.fullmatch(line):
            return
        self.total += 1
        rec = parse_line(line)
        if 'error' in rec:
            self.reasons[rec['error']] += 1
            return
        self.valid += 1
        self.ips[rec['ip']] = self.ips.get(rec['ip'], 0) + 1
        self.statuses[rec['status']] = self.statuses.get(rec['status'], 0) + 1
        self.methods[rec['method']] = self.methods.get(rec['method'], 0) + 1
        self.total_bytes += rec['bytes']

    def result(self) -> Dict[str, Any]:
        classes = {'1xx': 0, '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0}
        for code, count in self.statuses.items():
            classes['%dxx' % (code // 100)] += count
        error_count = classes['4xx'] + classes['5xx']
        top = sorted(self.ips.items(), key=lambda kv: (-kv[1], ip_sort_key(kv[0])))[:3]
        return {
            'total_lines': self.total,
            'valid_requests': self.valid,
            'malformed_lines': self.total - self.valid,
            'malformed_reasons': dict(self.reasons),
            'unique_ips': len(self.ips),
            'status_distribution': {str(k): self.statuses[k] for k in sorted(self.statuses)},
            'status_class_distribution': classes,
            'error_count': error_count,
            'error_rate': round_rate(error_count, self.valid),
            'total_bytes': self.total_bytes,
            'top_ips': [{'ip': ip, 'count': c} for ip, c in top],
            'methods': {k: self.methods[k] for k in sorted(self.methods)},
        }


class LogAnalyzer:
    """Convenience wrapper kept for API compatibility with the task example."""

    def parse_line(self, line: str) -> Dict[str, Any]:
        return parse_line(line)

    def analyze(self, text: str) -> Dict[str, Any]:
        agg = Aggregator()
        for piece in text.split('\n'):
            agg.feed(piece)
        return agg.result()


def analyze(text: str) -> Dict[str, Any]:
    return LogAnalyzer().analyze(text)


def to_canonical_json(result: Dict[str, Any]) -> str:
    return json.dumps(result, indent=2) + '\n'


def main(argv: Optional[List[str]] = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if len(argv) != 1:
        sys.stderr.write('usage: log_analyzer.py <logfile>\n')
        return 2
    agg = Aggregator()
    try:
        with open(argv[0], 'rb') as f:
            for raw in f:  # binary iteration splits on b'\n' only
                piece = raw.decode('utf-8', errors='replace')
                agg.feed(piece[:-1] if piece.endswith('\n') else piece)
    except OSError as exc:
        sys.stderr.write('cannot read %s: %s\n' % (argv[0], exc))
        return 1
    # Write bytes so Windows does not translate LF to CRLF (output must be byte-identical everywhere).
    sys.stdout.buffer.write(to_canonical_json(agg.result()).encode('utf-8'))
    sys.stdout.buffer.flush()
    return 0


if __name__ == '__main__':
    sys.exit(main())

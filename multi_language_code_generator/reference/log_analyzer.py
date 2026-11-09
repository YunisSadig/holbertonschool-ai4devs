"""Reference implementation (Python 3) of the Log Analyzer defined in
../cross_language_spec.md. Standard library only.

Usage:  python log_analyzer.py <logfile>
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


def round_rate(error_count: int, valid_requests: int) -> float:
    """Round-half-up to 4 decimals using integer arithmetic (spec section 7)."""
    if valid_requests == 0:
        return 0
    scaled = (error_count * 20000 + valid_requests) // (2 * valid_requests)
    return _canonical_number(scaled / 10000)


def _canonical_number(x: float):
    """Whole numbers are emitted as ints so text output matches other languages."""
    return int(x) if x == int(x) else x


class LogAnalyzer:
    def parse_line(self, line: str) -> Dict[str, Any]:
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

    def analyze(self, text: str) -> Dict[str, Any]:
        lines: List[str] = []
        for piece in text.split('\n'):
            if piece.endswith('\r'):
                piece = piece[:-1]
            if BLANK_RE.fullmatch(piece):
                continue
            lines.append(piece)

        reasons = {'bad_format': 0, 'invalid_ip': 0, 'invalid_status': 0}
        ips: Dict[str, int] = {}
        statuses: Dict[int, int] = {}
        methods: Dict[str, int] = {}
        total_bytes = 0
        valid = 0

        for line in lines:
            rec = self.parse_line(line)
            if 'error' in rec:
                reasons[rec['error']] += 1
                continue
            valid += 1
            ips[rec['ip']] = ips.get(rec['ip'], 0) + 1
            statuses[rec['status']] = statuses.get(rec['status'], 0) + 1
            methods[rec['method']] = methods.get(rec['method'], 0) + 1
            total_bytes += rec['bytes']

        classes = {'1xx': 0, '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0}
        for code, count in statuses.items():
            classes['%dxx' % (code // 100)] += count
        error_count = classes['4xx'] + classes['5xx']
        top = sorted(ips.items(), key=lambda kv: (-kv[1], ip_sort_key(kv[0])))[:3]

        return {
            'total_lines': len(lines),
            'valid_requests': valid,
            'malformed_lines': len(lines) - valid,
            'malformed_reasons': reasons,
            'unique_ips': len(ips),
            'status_distribution': {str(k): statuses[k] for k in sorted(statuses)},
            'status_class_distribution': classes,
            'error_count': error_count,
            'error_rate': round_rate(error_count, valid),
            'total_bytes': total_bytes,
            'top_ips': [{'ip': ip, 'count': c} for ip, c in top],
            'methods': {k: methods[k] for k in sorted(methods)},
        }


def analyze(text: str) -> Dict[str, Any]:
    return LogAnalyzer().analyze(text)


def to_canonical_json(result: Dict[str, Any]) -> str:
    return json.dumps(result, indent=2) + '\n'


def main(argv: Optional[List[str]] = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if len(argv) != 1:
        sys.stderr.write('usage: log_analyzer.py <logfile>\n')
        return 2
    try:
        with open(argv[0], 'rb') as f:
            text = f.read().decode('utf-8', errors='replace')
    except OSError as exc:
        sys.stderr.write('cannot read %s: %s\n' % (argv[0], exc))
        return 1
    sys.stdout.write(to_canonical_json(analyze(text)))
    return 0


if __name__ == '__main__':
    sys.exit(main())

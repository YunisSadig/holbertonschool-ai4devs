"""Deterministically generate a large Apache-style access log for benchmarking.

Usage: python generate_log.py <output_file> [lines=1000000] [seed=2026]

About 3% of the lines are intentionally malformed or blank, so every code path
(valid, bad_format, invalid_ip, invalid_status, blank) is exercised. IPs are drawn
from a pool of 50,000 addresses so the IP map is non-trivial.
"""
import random
import sys


def main() -> int:
    if len(sys.argv) < 2:
        sys.stderr.write(__doc__)
        return 2
    path = sys.argv[1]
    lines = int(sys.argv[2]) if len(sys.argv) > 2 else 1_000_000
    seed = int(sys.argv[3]) if len(sys.argv) > 3 else 2026
    rnd = random.Random(seed)
    pool = ['%d.%d.%d.%d' % (rnd.randint(1, 223), rnd.randint(0, 255), rnd.randint(0, 255),
                             rnd.randint(1, 254)) for _ in range(50_000)]
    methods = ['GET'] * 7 + ['POST'] * 2 + ['PUT', 'DELETE', 'HEAD']
    codes = [200] * 12 + [201, 204, 301, 302, 304, 400, 401, 403, 404, 404, 500, 502, 503]
    ts = '10/Oct/2023:13:55:36 +0000'
    with open(path, 'w', newline='\n', encoding='ascii') as f:
        buf = []
        for i in range(lines):
            r = rnd.random()
            if r < 0.01:
                buf.append('malformed line number %d' % i)
            elif r < 0.02:
                buf.append('999.1.1.1 - - [%s] "GET /x HTTP/1.1" 200 10' % ts)
            elif r < 0.03:
                buf.append('%s - - [%s] "GET /x HTTP/1.1" 777 10' % (rnd.choice(pool), ts))
            elif r < 0.035:
                buf.append('')
            else:
                size = '-' if rnd.random() < 0.05 else str(rnd.randint(0, 100000))
                buf.append('%s - - [%s] "%s /page/%d HTTP/1.1" %d %s' % (
                    rnd.choice(pool), ts, rnd.choice(methods), rnd.randint(0, 9999), rnd.choice(codes), size))
            if len(buf) >= 50_000:
                f.write('\n'.join(buf) + '\n')
                buf = []
        if buf:
            f.write('\n'.join(buf) + '\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())

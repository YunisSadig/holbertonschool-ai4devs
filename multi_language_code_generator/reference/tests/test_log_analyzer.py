"""Tests for the Python reference Log Analyzer (run: python -m unittest discover -s tests).

Fixture tests load all cases (six from the specification plus six extra edge cases) from tests/fixtures/*.json; the
expected values there come from an independent Node.js check of the spec.
"""
import glob
import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import log_analyzer as la  # noqa: E402

TS = '10/Oct/2023:13:55:36 +0000'


def line(ip='1.2.3.4', req='GET / HTTP/1.1', status=200, size=10):
    return '%s - - [%s] "%s" %s %s' % (ip, TS, req, status, size)


class SpecCaseTests(unittest.TestCase):
    def test_all_spec_cases_match_fixtures(self):
        files = sorted(glob.glob(os.path.join(HERE, 'fixtures', 'tc_*.json')))
        self.assertGreaterEqual(len(files), 12)
        for path in files:
            with open(path, encoding='utf-8') as f:
                case = json.load(f)
            with self.subTest(case=case['name']):
                self.assertEqual(la.analyze(case['input']), case['expected'])

    def test_case1_small_log(self):
        with open(os.path.join(HERE, 'fixtures', 'tc_T1_small.json'), encoding='utf-8') as f:
            case = json.load(f)
        r = la.analyze(case['input'])
        self.assertEqual((r['valid_requests'], r['unique_ips'], r['error_count']), (5, 3, 2))
        self.assertEqual(r['error_rate'], 0.4)
        self.assertEqual(r['total_bytes'], 1761)

    def test_case2_empty_input(self):
        r = la.analyze('')
        self.assertEqual(r['total_lines'], 0)
        self.assertEqual(r['status_distribution'], {})
        self.assertEqual(r['top_ips'], [])
        self.assertEqual(r['error_rate'], 0)

    def test_case3_blank_lines_not_counted(self):
        self.assertEqual(la.analyze('\n   \n\t\n'), la.analyze(''))

    def test_case4_malformed_reasons_sum(self):
        with open(os.path.join(HERE, 'fixtures', 'tc_T4_malformed.json'), encoding='utf-8') as f:
            case = json.load(f)
        r = la.analyze(case['input'])
        self.assertEqual(r['malformed_reasons'], {'bad_format': 3, 'invalid_ip': 2, 'invalid_status': 1})
        self.assertEqual(sum(r['malformed_reasons'].values()), r['malformed_lines'])
        self.assertEqual(r['valid_requests'] + r['malformed_lines'], r['total_lines'])

    def test_case5_numeric_ip_tiebreak(self):
        with open(os.path.join(HERE, 'fixtures', 'tc_T5_ties_dash_crlf.json'), encoding='utf-8') as f:
            case = json.load(f)
        r = la.analyze(case['input'])
        self.assertEqual([x['ip'] for x in r['top_ips']][:2], ['10.0.0.9', '10.0.0.10'])
        self.assertEqual(r['total_bytes'], 36)


class UnitTests(unittest.TestCase):
    def test_parse_line_valid(self):
        rec = la.LogAnalyzer().parse_line(line('10.0.0.5', 'POST /login HTTP/1.1', 302, 0))
        self.assertEqual(rec, {'ip': '10.0.0.5', 'method': 'POST', 'status': 302, 'bytes': 0})

    def test_parse_line_error_reasons(self):
        p = la.LogAnalyzer().parse_line
        self.assertEqual(p('garbage'), {'error': 'bad_format'})
        self.assertEqual(p(line(ip='256.1.1.1')), {'error': 'invalid_ip'})
        self.assertEqual(p(line(ip='1.2.3')), {'error': 'invalid_ip'})
        self.assertEqual(p(line(status=600)), {'error': 'invalid_status'})
        self.assertEqual(p(line(status=99)), {'error': 'bad_format'})

    def test_rounding_is_half_up_not_half_even(self):
        # 1 error out of 16 requests = 0.0625 exactly; 4 decimals -> 0.0625
        self.assertEqual(la.round_rate(1, 16), 0.0625)
        # 1/32 = 0.03125 exactly -> half-up gives 0.0313 (round() would give 0.0312)
        self.assertEqual(la.round_rate(1, 32), 0.0313)
        self.assertEqual(la.round_rate(2, 3), 0.6667)

    def test_error_rate_zero_and_one_are_ints(self):
        self.assertIs(type(la.round_rate(0, 0)), int)
        self.assertIs(type(la.round_rate(5, 5)), int)
        self.assertEqual(la.round_rate(5, 5), 1)

    def test_status_class_and_distribution_order(self):
        text = '\n'.join([line(status=503), line(status=101), line(status=404), line(status=200)])
        r = la.analyze(text)
        self.assertEqual(list(r['status_distribution']), ['101', '200', '404', '503'])
        self.assertEqual(r['status_class_distribution'],
                         {'1xx': 1, '2xx': 1, '3xx': 0, '4xx': 1, '5xx': 1})
        self.assertEqual(r['error_count'], 2)

    def test_top_ips_limited_to_three_and_methods_sorted(self):
        text = '\n'.join([line('1.1.1.%d' % i, 'PUT /x HTTP/1.1') for i in range(1, 6)]
                         + [line('2.2.2.2', 'GET /x HTTP/1.1')])
        r = la.analyze(text)
        self.assertEqual(len(r['top_ips']), 3)
        self.assertEqual(list(r['methods']), ['GET', 'PUT'])

    def test_no_trailing_newline_and_crlf_equivalent(self):
        a = '\n'.join([line('1.1.1.1'), line('1.1.1.2', status=500)])
        self.assertEqual(la.analyze(a), la.analyze(a.replace('\n', '\r\n') + '\r\n'))
        self.assertEqual(la.analyze(a)['valid_requests'], 2)

    def test_output_key_order_and_canonical_json(self):
        r = la.analyze(line())
        self.assertEqual(list(r), [
            'total_lines', 'valid_requests', 'malformed_lines', 'malformed_reasons',
            'unique_ips', 'status_distribution', 'status_class_distribution',
            'error_count', 'error_rate', 'total_bytes', 'top_ips', 'methods'])
        text = la.to_canonical_json(r)
        self.assertTrue(text.endswith('}\n'))
        self.assertIn('"error_rate": 0,', text)


class CliTests(unittest.TestCase):
    def run_cli(self, *args):
        return subprocess.run([sys.executable, os.path.join(os.path.dirname(HERE), 'log_analyzer.py'), *args],
                              capture_output=True, text=True)

    def test_cli_prints_json_for_file(self):
        with tempfile.NamedTemporaryFile('w', suffix='.log', delete=False, encoding='utf-8') as f:
            f.write(line() + '\n')
            path = f.name
        try:
            res = self.run_cli(path)
        finally:
            os.unlink(path)
        self.assertEqual(res.returncode, 0)
        self.assertEqual(json.loads(res.stdout)['valid_requests'], 1)

    def test_cli_unreadable_file_exit_code(self):
        res = self.run_cli(os.path.join(tempfile.gettempdir(), 'definitely_missing_file.log'))
        self.assertNotEqual(res.returncode, 0)
        self.assertEqual(res.stdout, '')


if __name__ == '__main__':
    unittest.main()

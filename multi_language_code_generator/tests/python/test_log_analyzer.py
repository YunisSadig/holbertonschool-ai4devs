"""Shared-fixture tests for the Python implementation.

Each tests/fixtures/<case>.log is analyzed and the canonical JSON text must equal
tests/fixtures/<case>.expected.json byte for byte. The JavaScript and Java
tests use the very same fixture files.

Run from multi_language_code_generator/:  python -m unittest discover -s tests/python -v
"""
import glob
import os
import subprocess
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FIXTURES = os.path.join(ROOT, 'tests', 'fixtures')
IMPL = os.path.join(ROOT, 'implementations', 'python')
sys.path.insert(0, IMPL)

import log_analyzer as la  # noqa: E402


def cases():
    logs = sorted(glob.glob(os.path.join(FIXTURES, '*.log')))
    return [(os.path.basename(p)[:-4], p, p[:-4] + '.expected.json') for p in logs]


def read(path):
    with open(path, 'rb') as f:
        return f.read()


class SharedFixtureTests(unittest.TestCase):
    def test_at_least_twelve_shared_cases(self):
        self.assertGreaterEqual(len(cases()), 12)

    def test_api_output_matches_expected_bytes(self):
        for name, log, expected in cases():
            with self.subTest(case=name):
                text = read(log).decode('utf-8', errors='replace')
                got = la.to_canonical_json(la.analyze(text)).encode('utf-8')
                self.assertEqual(got, read(expected))

    def test_cli_output_matches_expected_bytes(self):
        for name, log, expected in cases():
            with self.subTest(case=name):
                res = subprocess.run([sys.executable, os.path.join(IMPL, 'log_analyzer.py'), log],
                                     capture_output=True)
                self.assertEqual(res.returncode, 0)
                self.assertEqual(res.stdout, read(expected))

    def test_cli_unreadable_file(self):
        missing = os.path.join(tempfile.gettempdir(), 'no_such_log_file.log')
        res = subprocess.run([sys.executable, os.path.join(IMPL, 'log_analyzer.py'), missing],
                             capture_output=True)
        self.assertNotEqual(res.returncode, 0)
        self.assertEqual(res.stdout, b'')


if __name__ == '__main__':
    unittest.main()

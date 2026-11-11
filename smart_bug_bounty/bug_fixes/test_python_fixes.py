"""Tests asserting the INTENDED behaviour, run against bug1_fixed.py and bug2_fixed.py.

They are expected to PASS against the fixed versions in ../bug_fixes.
Run: py -m unittest discover -s bug_fixes -p "test_python_fixes.py" -v   (from smart_bug_bounty/)
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import bug1_fixed as bug1  # noqa: E402
import bug2_fixed as bug2  # noqa: E402


class TestBug1(unittest.TestCase):
    def test_last_three(self):
        self.assertEqual(bug1.last_n_items([1, 2, 3, 4, 5], 3), [3, 4, 5])

    def test_n_larger_than_list(self):
        self.assertEqual(bug1.last_n_items([1, 2], 5), [1, 2])

    def test_zero_returns_empty(self):
        self.assertEqual(bug1.last_n_items([1, 2], 0), [])


class TestBug2(unittest.TestCase):
    def test_average(self):
        self.assertEqual(bug2.average([90, 80]), 85.0)

    def test_empty_average_is_none(self):
        self.assertIsNone(bug2.average([]))

    def test_class_report_with_empty_student(self):
        self.assertEqual(bug2.class_report({"ana": [90, 80], "bob": []}),
                         {"ana": 85.0, "bob": None})


if __name__ == "__main__":
    unittest.main()

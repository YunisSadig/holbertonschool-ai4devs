"""Cross-language equivalence check.

Compiles the Java version, then runs the Python, JavaScript and Java command-line
programs on every shared fixture and on a generated stress file, and requires:
  * each program's stdout equals the expected canonical JSON (byte for byte), and
  * all three programs print identical bytes for the same input.

Run from multi_language_code_generator/:  python tests/run_all.py
Requires: Python 3, Node.js, and a JDK (javac/java) on PATH.
"""
import glob
import os
import random
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIX = os.path.join(ROOT, 'tests', 'fixtures')
BUILD = os.path.join(ROOT, 'build', 'java')


def run(cmd):
    return subprocess.run(cmd, capture_output=True)


def build_java():
    os.makedirs(BUILD, exist_ok=True)
    res = run(['javac', '-d', BUILD, os.path.join(ROOT, 'implementations', 'java', 'LogAnalyzer.java')])
    if res.returncode != 0:
        sys.stderr.write(res.stderr.decode())
        sys.exit('javac failed')


COMMANDS = {
    'python': [sys.executable, os.path.join(ROOT, 'implementations', 'python', 'log_analyzer.py')],
    'javascript': ['node', os.path.join(ROOT, 'implementations', 'javascript', 'log_analyzer.js')],
    'java': ['java', '-cp', BUILD, 'LogAnalyzer'],
}


def stress_file(path, lines=20000, seed=12345):
    """Deterministic mix of valid and malformed lines."""
    rnd = random.Random(seed)
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD']
    codes = [200, 200, 200, 201, 301, 304, 400, 404, 404, 500, 503]
    with open(path, 'w', newline='\n', encoding='ascii') as f:
        for i in range(lines):
            r = rnd.random()
            if r < 0.01:
                f.write('garbage line %d\n' % i)
            elif r < 0.02:
                f.write('300.1.1.1 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 200 5\n')
            elif r < 0.03:
                f.write('1.2.3.4 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 999 5\n')
            elif r < 0.04:
                f.write('\n')
            else:
                f.write('%d.%d.%d.%d - - [10/Oct/2023:13:55:36 +0000] "%s /p%d HTTP/1.1" %d %s\n' % (
                    rnd.randint(1, 3), rnd.randint(0, 9), rnd.randint(0, 9), rnd.randint(0, 20),
                    rnd.choice(methods), i, rnd.choice(codes), rnd.choice(['-', str(rnd.randint(0, 5000))])))


def main():
    build_java()
    inputs = [(os.path.basename(p)[:-4], p, p[:-4] + '.expected.json')
              for p in sorted(glob.glob(os.path.join(FIX, '*.log')))]
    tmp = tempfile.mkdtemp()
    stress = os.path.join(tmp, 'stress.log')
    stress_file(stress)
    inputs.append(('stress_20000_lines', stress, None))

    failures = 0
    for name, path, expected_path in inputs:
        outputs = {}
        for lang, cmd in COMMANDS.items():
            res = run(cmd + [path])
            outputs[lang] = res.stdout
            if res.returncode != 0:
                failures += 1
                print('FAIL  %-34s %-10s exit code %d' % (name, lang, res.returncode))
        same = len(set(outputs.values())) == 1
        matches = True
        if expected_path:
            with open(expected_path, 'rb') as f:
                expected = f.read()
            matches = all(out == expected for out in outputs.values())
        if same and matches:
            print('ok    %-34s python == javascript == java%s' % (name, ' == expected' if expected_path else ''))
        else:
            failures += 1
            print('FAIL  %-34s identical=%s matches_expected=%s' % (name, same, matches))

    for lang, cmd in COMMANDS.items():
        res = run(cmd + [os.path.join(tmp, 'does_not_exist.log')])
        if res.returncode == 0 or res.stdout:
            failures += 1
            print('FAIL  unreadable file %-10s exit=%d stdout=%d bytes' % (lang, res.returncode, len(res.stdout)))
        else:
            print('ok    unreadable file -> non-zero exit, no stdout (%s)' % lang)

    print('\n%d check(s) failed' % failures if failures else '\nall equivalence checks passed')
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()

"""Benchmark the Python, JavaScript and Java log analyzers: wall-clock runtime and peak memory.

Usage (from multi_language_code_generator/):
    python benchmarks/generate_log.py build/bench_1m.log 1000000
    python benchmarks/run_benchmark.py build/bench_1m.log [runs=5]

Method
  * Each run is a fresh OS process of the command-line program (so runtime includes
    interpreter / VM start-up and, for Java, JIT warm-up).
  * Runtime: time.perf_counter() around spawn -> exit.
  * Memory: the process's peak working set. On Windows it is read with
    GetProcessMemoryInfo (PeakWorkingSetSize) from the child's handle after exit.
    On Linux/macOS it uses the child's ru_maxrss from a helper process.
  * Every run's stdout is hashed; the benchmark fails if the languages disagree.
Results are printed as JSON followed by a Markdown table.
"""
import hashlib
import json
import os
import statistics
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, 'build', 'java')

COMMANDS = {
    'Python': [sys.executable, os.path.join(ROOT, 'implementations', 'python', 'log_analyzer.py')],
    'JavaScript': ['node', os.path.join(ROOT, 'implementations', 'javascript', 'log_analyzer.js')],
    'Java': ['java', '-cp', BUILD, 'LogAnalyzer'],
}


def compile_java():
    os.makedirs(BUILD, exist_ok=True)
    res = subprocess.run(['javac', '-d', BUILD, os.path.join(ROOT, 'implementations', 'java', 'LogAnalyzer.java')],
                         capture_output=True)
    if res.returncode != 0:
        sys.exit('javac failed: ' + res.stderr.decode(errors='replace'))


def peak_memory_windows(popen):
    import ctypes
    from ctypes import wintypes

    class PMC(ctypes.Structure):
        _fields_ = [('cb', wintypes.DWORD), ('PageFaultCount', wintypes.DWORD),
                    ('PeakWorkingSetSize', ctypes.c_size_t), ('WorkingSetSize', ctypes.c_size_t),
                    ('QuotaPeakPagedPoolUsage', ctypes.c_size_t), ('QuotaPagedPoolUsage', ctypes.c_size_t),
                    ('QuotaPeakNonPagedPoolUsage', ctypes.c_size_t), ('QuotaNonPagedPoolUsage', ctypes.c_size_t),
                    ('PagefileUsage', ctypes.c_size_t), ('PeakPagefileUsage', ctypes.c_size_t)]

    pmc = PMC()
    pmc.cb = ctypes.sizeof(PMC)
    handle = wintypes.HANDLE(int(popen._handle))
    ok = ctypes.windll.psapi.GetProcessMemoryInfo(handle, ctypes.byref(pmc), pmc.cb)
    if not ok:
        raise OSError('GetProcessMemoryInfo failed')
    return pmc.PeakWorkingSetSize / (1024 * 1024)


def run_once(cmd, path):
    start = time.perf_counter()
    if os.name == 'nt':
        p = subprocess.Popen(cmd + [path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = p.communicate()
        elapsed = time.perf_counter() - start
        mem = peak_memory_windows(p)
        code = p.returncode
    else:
        helper = ('import resource,subprocess,sys;'
                  'p=subprocess.run(sys.argv[1:],capture_output=True);'
                  'sys.stdout.buffer.write(p.stdout);'
                  'sys.stderr.write("RSS %d\\n"%resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss);'
                  'sys.exit(p.returncode)')
        p = subprocess.run([sys.executable, '-c', helper] + cmd + [path], capture_output=True)
        elapsed = time.perf_counter() - start
        out, err, code = p.stdout, p.stderr, p.returncode
        rss = [l for l in err.decode().splitlines() if l.startswith('RSS ')]
        mem = (int(rss[-1].split()[1]) / 1024) if rss else float('nan')  # KiB on Linux
    if code != 0:
        sys.exit('command failed: %s\n%s' % (cmd, err.decode(errors='replace')))
    return elapsed, mem, hashlib.sha256(out).hexdigest()


def main():
    if len(sys.argv) < 2:
        sys.stderr.write(__doc__)
        return 2
    path = os.path.abspath(sys.argv[1])
    runs = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    compile_java()
    lines = 0
    with open(path, 'rb') as f:
        for _ in f:
            lines += 1
    results = {}
    hashes = set()
    for lang, cmd in COMMANDS.items():
        times, mems = [], []
        run_once(cmd, path)  # untimed warm-up (file cache, JIT-independent OS warm-up)
        for _ in range(runs):
            t, m, h = run_once(cmd, path)
            times.append(t)
            mems.append(m)
            hashes.add(h)
        results[lang] = {
            'runtime_s': {'median': statistics.median(times), 'min': min(times), 'max': max(times), 'all': times},
            'peak_memory_mb': {'median': statistics.median(mems), 'min': min(mems), 'max': max(mems), 'all': mems},
        }
    meta = {'file': os.path.basename(path), 'file_size_mb': os.path.getsize(path) / 1048576,
            'lines': lines, 'runs_per_language': runs, 'identical_output_across_languages': len(hashes) == 1,
            'os': os.name, 'cpu_count': os.cpu_count()}
    print(json.dumps({'meta': meta, 'results': results}, indent=2))
    print('\n| Language | Runtime median (s) | min-max (s) | Peak memory median (MB) | min-max (MB) |')
    print('|---|---|---|---|---|')
    for lang, r in results.items():
        print('| %s | %.2f | %.2f-%.2f | %.0f | %.0f-%.0f |' % (
            lang, r['runtime_s']['median'], r['runtime_s']['min'], r['runtime_s']['max'],
            r['peak_memory_mb']['median'], r['peak_memory_mb']['min'], r['peak_memory_mb']['max']))
    return 0 if meta['identical_output_across_languages'] else 1


if __name__ == '__main__':
    sys.exit(main())

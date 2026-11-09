# Cross-Language Specification - Log Analyzer

Target languages: **Python 3**, **JavaScript (Node.js)**, **Java**. Any implementation that follows this document must produce the same JSON for the same input.

## 1. Algorithm Overview
The Log Analyzer reads a web-server access log in Apache **Common Log Format**, validates each line, and computes summary statistics: total valid requests, malformed-line counts, unique client IPs, status-code distributions, error rate, total bytes, top clients and request methods. It is a single pass over the input with hash-map aggregation, so it exercises parsing, validation, counting, sorting and number formatting - the places where languages usually differ.

## 2. Functional Requirements
- FR1. Read the whole input as UTF-8 text. Reference interface: `analyze(text) -> object` plus a command-line program `<program> <file>` that prints the JSON.
- FR2. Classify every non-blank line as valid or malformed (section 5).
- FR3. Compute the statistics in section 4 from valid lines only.
- FR4. Never crash on bad input; malformed lines are counted, not fatal.
- FR5. Print exactly one JSON object (section 4) followed by a newline.
- FR6. Exit code 0 for any readable input (including empty); non-zero only if the file cannot be read.

## 3. Input Format
One record per line:

```text
<ip> <ident> <user> [<timestamp>] "<METHOD> <path> <protocol>" <status> <bytes>
```

Example valid records:

```text
192.168.0.1 - - [10/Oct/2023:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 1024
10.0.0.5 - frank [10/Oct/2023:13:56:01 +0000] "POST /login HTTP/1.1" 302 0
10.0.0.5 - - [10/Oct/2023:13:57:12 +0000] "GET /missing HTTP/1.1" 404 -
```

Examples of malformed lines: `not a log line`; a line whose IP is `300.1.1.1` (invalid IP); a line with status `999` (invalid status); a line missing the bytes field.

## 4. Output Format (JSON schema)
One JSON object with exactly these keys, in this order:

| Key | Type | Meaning |
|---|---|---|
| `total_lines` | integer | Non-blank lines read |
| `valid_requests` | integer | Lines accepted as valid |
| `malformed_lines` | integer | `total_lines - valid_requests` |
| `malformed_reasons` | object | Integers `bad_format`, `invalid_ip`, `invalid_status` (always all three, in this order); they sum to `malformed_lines` |
| `unique_ips` | integer | Distinct IPs among valid lines |
| `status_distribution` | object | Status code as a **string** key -> count; only codes that occurred; keys in ascending numeric order |
| `status_class_distribution` | object | Keys `1xx`, `2xx`, `3xx`, `4xx`, `5xx` always present, in that order |
| `error_count` | integer | Count of 4xx plus 5xx requests |
| `error_rate` | number | `error_count / valid_requests` rounded to 4 decimals (rule in section 7); `0` when `valid_requests` is 0 |
| `total_bytes` | integer | Sum of the bytes field over valid lines; `-` counts as 0 |
| `top_ips` | array | Up to 3 objects `{"ip": string, "count": integer}` |
| `methods` | object | Method -> count, keys in ascending ASCII order |

JSON schema (abbreviated): all keys required, `additionalProperties: false`, integers are non-negative, `error_rate` is between 0 and 1.

## 5. Parsing and Aggregation Rules
1. **Line splitting**: split on LF; remove one trailing CR from each line; a final empty piece after a trailing newline is ignored. Lines that are empty or contain only whitespace (space, tab) are skipped and **not** counted anywhere.
2. **Format check** (no trimming of the line): it must match exactly this regular expression (ASCII, case-sensitive):
   `^(\S+) \S+ \S+ \[(\d{2}/[A-Z][a-z]{2}/\d{4}:\d{2}:\d{2}:\d{2} [+-]\d{4})\] "([A-Z]+) (\S+) (HTTP/\d\.\d)" (\d{3}) (\d+|-)$`
   A line that does not match is **malformed: bad_format**. The timestamp is checked by shape only (no calendar validation).
3. **IP check**: group 1 must be four dot-separated decimal fields, each 1-3 digits with value 0-255. Otherwise **malformed: invalid_ip**. IPv6 is not supported; such a line counts as invalid_ip when the line shape matches.
4. **Status check**: the three-digit status must be 100-599, otherwise **malformed: invalid_status**.
5. Checks run in the order 2, 3, 4; a line is counted under the first reason that fails.
6. **Valid line**: update `valid_requests`, the IP map, the status map, the method map and `total_bytes`.
7. **Status classes**: class = status divided by 100, integer division.
8. **top_ips**: sort by count descending, then by IP ascending comparing the four octets as **numbers** (so 10.0.0.9 sorts before 10.0.0.10); keep at most 3.
9. **methods and status keys** are sorted as stated in section 4.

## 6. Error Handling and Edge Cases
| Case | Required behavior |
|---|---|
| Empty input | All counts 0, `error_rate` 0, `status_distribution` `{}`, `top_ips` `[]`, `methods` `{}` |
| Only blank lines | Same as empty input |
| Malformed line | Counted in `malformed_*`; processing continues |
| Missing field (for example no bytes) | bad_format |
| Invalid IP, for example 300.1.1.1 | invalid_ip |
| IP with three octets, for example 1.2.3 | invalid_ip (line shape is otherwise valid) |
| Invalid status such as 999 | invalid_status |
| Status with 2 or 4 digits | bad_format |
| Bytes is `-` | Valid; adds 0 |
| CRLF line endings | Handled as in rule 1 |
| No trailing newline | Handled; last line is still read |
| Very large input | Read line by line; do not keep all lines in memory |
| Unreadable file | Message on stderr, non-zero exit code, no JSON |
| Invalid UTF-8 bytes | Replace with U+FFFD while decoding; the line then normally fails the format check |

## 7. Deterministic Behavior Requirements
- **Key set and key order** are fixed (section 4). Test harnesses compare parsed JSON for equality. Canonical text output is 2-space-indented JSON followed by one newline, as in the examples below.
- **No locale dependence**: sorting uses numeric comparison or ASCII comparison only.
- **Rounding**: `error_rate = floor((error_count * 20000 + valid_requests) / (2 * valid_requests)) / 10000`, with the numerator and floor division done in integers (round half up to 4 decimals), then divided by 10000. Do not use language rounding functions (Python's `round` rounds half to even).
- **Number serialization**: counts are JSON integers; `error_rate` is a JSON number (for example 0, 0.4, 0.6667, 1); equality is numeric.
- **Hash-map iteration order must never reach the output**: always sort before output.
- **No time, randomness or environment** may influence the result.

## 8. Test Cases
Each input is exact text. The expected outputs were generated and checked with a throwaway reference implementation (Node.js) written while preparing this specification. Independent Python and Java implementations are still to be written and must match them.

### TC1 - Small valid log

Five valid lines; two IPs tied for top; mixed statuses.

**Input** (374 bytes; ends with a trailing newline):

```text
192.168.0.1 - - [10/Oct/2023:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 1024
192.168.0.2 - - [10/Oct/2023:13:55:36 +0000] "GET /about HTTP/1.1" 200 512
192.168.0.1 - - [10/Oct/2023:13:55:36 +0000] "POST /login HTTP/1.1" 302 0
10.0.0.5 - - [10/Oct/2023:13:55:36 +0000] "GET /missing HTTP/1.1" 404 150
10.0.0.5 - - [10/Oct/2023:13:55:36 +0000] "GET /boom HTTP/1.1" 500 75
```

**Expected output**:

```json
{
  "total_lines": 5,
  "valid_requests": 5,
  "malformed_lines": 0,
  "malformed_reasons": {
    "bad_format": 0,
    "invalid_ip": 0,
    "invalid_status": 0
  },
  "unique_ips": 3,
  "status_distribution": {
    "200": 2,
    "302": 1,
    "404": 1,
    "500": 1
  },
  "status_class_distribution": {
    "1xx": 0,
    "2xx": 2,
    "3xx": 1,
    "4xx": 1,
    "5xx": 1
  },
  "error_count": 2,
  "error_rate": 0.4,
  "total_bytes": 1761,
  "top_ips": [
    {
      "ip": "10.0.0.5",
      "count": 2
    },
    {
      "ip": "192.168.0.1",
      "count": 2
    },
    {
      "ip": "192.168.0.2",
      "count": 1
    }
  ],
  "methods": {
    "GET": 4,
    "POST": 1
  }
}
```

### TC2 - Empty input

Zero bytes of input.

**Input** (0 bytes):

```text
(empty input: zero bytes)
```

**Expected output**:

```json
{
  "total_lines": 0,
  "valid_requests": 0,
  "malformed_lines": 0,
  "malformed_reasons": {
    "bad_format": 0,
    "invalid_ip": 0,
    "invalid_status": 0
  },
  "unique_ips": 0,
  "status_distribution": {},
  "status_class_distribution": {
    "1xx": 0,
    "2xx": 0,
    "3xx": 0,
    "4xx": 0,
    "5xx": 0
  },
  "error_count": 0,
  "error_rate": 0,
  "total_bytes": 0,
  "top_ips": [],
  "methods": {}
}
```

### TC3 - Whitespace-only input

Only blank/whitespace lines; they are skipped, not malformed.

**Input** (7 bytes; ends with a trailing newline):

```text

   
	
```

**Expected output**:

```json
{
  "total_lines": 0,
  "valid_requests": 0,
  "malformed_lines": 0,
  "malformed_reasons": {
    "bad_format": 0,
    "invalid_ip": 0,
    "invalid_status": 0
  },
  "unique_ips": 0,
  "status_distribution": {},
  "status_class_distribution": {
    "1xx": 0,
    "2xx": 0,
    "3xx": 0,
    "4xx": 0,
    "5xx": 0
  },
  "error_count": 0,
  "error_rate": 0,
  "total_bytes": 0,
  "top_ips": [],
  "methods": {}
}
```

### TC4 - Malformed records

Garbage line, invalid IP, status 999, 2-digit status, missing bytes field, 3-octet IP. One valid line.

**Input** (427 bytes):

```text
192.168.0.1 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 200 100
this is not a log line
300.1.1.1 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 200 100
192.168.0.9 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 999 100
192.168.0.9 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 99 100
192.168.0.1 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 200
1.2.3 - - [10/Oct/2023:13:55:36 +0000] "GET / HTTP/1.1" 200 5
```

**Expected output**:

```json
{
  "total_lines": 7,
  "valid_requests": 1,
  "malformed_lines": 6,
  "malformed_reasons": {
    "bad_format": 3,
    "invalid_ip": 2,
    "invalid_status": 1
  },
  "unique_ips": 1,
  "status_distribution": {
    "200": 1
  },
  "status_class_distribution": {
    "1xx": 0,
    "2xx": 1,
    "3xx": 0,
    "4xx": 0,
    "5xx": 0
  },
  "error_count": 0,
  "error_rate": 0,
  "total_bytes": 100,
  "top_ips": [
    {
      "ip": "192.168.0.1",
      "count": 1
    }
  ],
  "methods": {
    "GET": 1
  }
}
```

### TC5 - Ties, "-" bytes, CRLF

CRLF line endings, `-` bytes, and a count tie that tests numeric (not text) IP ordering: 10.0.0.9 must come before 10.0.0.10.

**Input** (474 bytes; every line ends with CR LF (\r\n), shown here as plain line breaks; ends with a trailing newline):

```text
10.0.0.10 - - [10/Oct/2023:13:55:36 +0000] "GET /a HTTP/1.1" 200 -
10.0.0.9 - - [10/Oct/2023:13:55:36 +0000] "HEAD /a HTTP/1.1" 200 -
10.0.0.9 - - [10/Oct/2023:13:55:36 +0000] "GET /b HTTP/1.1" 200 10
10.0.0.10 - - [10/Oct/2023:13:55:36 +0000] "GET /c HTTP/1.1" 200 20
9.0.0.1 - - [10/Oct/2023:13:55:36 +0000] "GET /d HTTP/1.1" 200 5
9.0.0.2 - - [10/Oct/2023:13:55:36 +0000] "DELETE /e HTTP/1.1" 204 0
9.0.0.3 - - [10/Oct/2023:13:55:36 +0000] "GET /f HTTP/1.1" 200 1
```

**Expected output**:

```json
{
  "total_lines": 7,
  "valid_requests": 7,
  "malformed_lines": 0,
  "malformed_reasons": {
    "bad_format": 0,
    "invalid_ip": 0,
    "invalid_status": 0
  },
  "unique_ips": 5,
  "status_distribution": {
    "200": 6,
    "204": 1
  },
  "status_class_distribution": {
    "1xx": 0,
    "2xx": 7,
    "3xx": 0,
    "4xx": 0,
    "5xx": 0
  },
  "error_count": 0,
  "error_rate": 0,
  "total_bytes": 36,
  "top_ips": [
    {
      "ip": "10.0.0.9",
      "count": 2
    },
    {
      "ip": "10.0.0.10",
      "count": 2
    },
    {
      "ip": "9.0.0.1",
      "count": 1
    }
  ],
  "methods": {
    "DELETE": 1,
    "GET": 5,
    "HEAD": 1
  }
}
```

### TC6 - Rounding of error_rate

2 errors out of 3 requests: 2/3 = 0.6667 after round-half-up to 4 decimals.

**Input** (194 bytes):

```text
1.1.1.1 - - [10/Oct/2023:13:55:36 +0000] "GET /x HTTP/1.1" 404 1
1.1.1.1 - - [10/Oct/2023:13:55:36 +0000] "GET /x HTTP/1.1" 503 1
1.1.1.2 - - [10/Oct/2023:13:55:36 +0000] "GET /x HTTP/1.1" 200 1
```

**Expected output**:

```json
{
  "total_lines": 3,
  "valid_requests": 3,
  "malformed_lines": 0,
  "malformed_reasons": {
    "bad_format": 0,
    "invalid_ip": 0,
    "invalid_status": 0
  },
  "unique_ips": 2,
  "status_distribution": {
    "200": 1,
    "404": 1,
    "503": 1
  },
  "status_class_distribution": {
    "1xx": 0,
    "2xx": 1,
    "3xx": 0,
    "4xx": 1,
    "5xx": 1
  },
  "error_count": 2,
  "error_rate": 0.6667,
  "total_bytes": 3,
  "top_ips": [
    {
      "ip": "1.1.1.1",
      "count": 2
    },
    {
      "ip": "1.1.1.2",
      "count": 1
    }
  ],
  "methods": {
    "GET": 3
  }
}
```

## 9. Expected Complexity
Let n be the number of lines, u the number of distinct IPs and L the average line length.
- Time: O(n * L) for parsing plus O(u log u) for sorting the IPs, so O(n * L + u log u).
- Space: O(u + s + m), where s is at most 500 distinct status codes and m the number of distinct methods. Lines are processed one at a time, so memory grows only with the IP map.

## 10. Language-Independent Acceptance Criteria
1. All six test cases in section 8 produce exactly the expected JSON in Python, JavaScript and Java.
2. The three implementations produce identical canonical output for the same file, byte for byte.
3. No implementation crashes on any input described in section 6.
4. `malformed_reasons` always sums to `malformed_lines`; `valid_requests + malformed_lines = total_lines`; `error_count` equals the 4xx plus 5xx counts.
5. Each implementation includes automated tests covering the six cases and passes them.
6. Throughput: a 1,000,000-line file is processed in a reasonable time on a laptop (target under 10 seconds per implementation; to be measured, not assumed).

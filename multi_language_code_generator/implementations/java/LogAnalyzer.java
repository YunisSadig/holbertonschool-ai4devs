import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Java translation of the Log Analyzer in ../../cross_language_spec.md.
 * Standard library only (no JSON library: the canonical JSON is written by hand).
 *
 * Usage: java LogAnalyzer <logfile>
 */
public class LogAnalyzer {
    // Java's \S and \d are ASCII-only by default, matching the specification.
    private static final Pattern LINE_RE = Pattern.compile(
        "(\\S+) \\S+ \\S+ \\[(\\d{2}/[A-Z][a-z]{2}/\\d{4}:\\d{2}:\\d{2}:\\d{2} [+-]\\d{4})\\] "
            + "\"([A-Z]+) (\\S+) (HTTP/\\d\\.\\d)\" (\\d{3}) (\\d+|-)");
    private static final Pattern IP_FIELD_RE = Pattern.compile("\\d{1,3}");

    private long total = 0;
    private long valid = 0;
    private long badFormat = 0;
    private long invalidIp = 0;
    private long invalidStatus = 0;
    private long totalBytes = 0;
    private final Map<String, Long> ips = new HashMap<>();
    private final Map<Integer, Long> statuses = new TreeMap<>();
    private final Map<String, Long> methods = new TreeMap<>();

    static boolean isValidIp(String ip) {
        String[] parts = ip.split("\\.", -1);
        if (parts.length != 4) {
            return false;
        }
        for (String p : parts) {
            if (!IP_FIELD_RE.matcher(p).matches() || Integer.parseInt(p) > 255) {
                return false;
            }
        }
        return true;
    }

    static int ipCompare(String a, String b) {
        String[] x = a.split("\\.");
        String[] y = b.split("\\.");
        for (int i = 0; i < 4; i++) {
            int cmp = Integer.compare(Integer.parseInt(x[i]), Integer.parseInt(y[i]));
            if (cmp != 0) {
                return cmp;
            }
        }
        return 0;
    }

    private static boolean isBlank(String s) {
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c != ' ' && c != '\t') {
                return false;
            }
        }
        return true;
    }

    public void feed(String line) {
        if (line.endsWith("\r")) {
            line = line.substring(0, line.length() - 1);
        }
        if (isBlank(line)) {
            return;
        }
        total++;
        Matcher m = LINE_RE.matcher(line);
        if (!m.matches()) {
            badFormat++;
            return;
        }
        if (!isValidIp(m.group(1))) {
            invalidIp++;
            return;
        }
        int status = Integer.parseInt(m.group(6));
        if (status < 100 || status > 599) {
            invalidStatus++;
            return;
        }
        valid++;
        ips.merge(m.group(1), 1L, Long::sum);
        statuses.merge(status, 1L, Long::sum);
        methods.merge(m.group(3), 1L, Long::sum);
        String rawBytes = m.group(7);
        totalBytes += rawBytes.equals("-") ? 0L : Long.parseLong(rawBytes);
    }

    /** error_rate as the exact JSON text used by every language (spec section 7). */
    static String formatRate(long errorCount, long validRequests) {
        if (validRequests == 0) {
            return "0";
        }
        long scaled = (errorCount * 20000L + validRequests) / (2L * validRequests);
        if (scaled % 10000 == 0) {
            return Long.toString(scaled / 10000);
        }
        String frac = String.format("%04d", scaled % 10000);
        int end = frac.length();
        while (frac.charAt(end - 1) == '0') {
            end--;
        }
        return (scaled / 10000) + "." + frac.substring(0, end);
    }

    /** Canonical JSON: 2-space indentation, fixed key order, trailing newline. */
    public String toCanonicalJson() {
        long[] classes = new long[5];
        for (Map.Entry<Integer, Long> e : statuses.entrySet()) {
            classes[e.getKey() / 100 - 1] += e.getValue();
        }
        long errorCount = classes[3] + classes[4];

        List<Map.Entry<String, Long>> sorted = new ArrayList<>(ips.entrySet());
        sorted.sort((a, b) -> {
            int c = Long.compare(b.getValue(), a.getValue());
            return c != 0 ? c : ipCompare(a.getKey(), b.getKey());
        });

        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"total_lines\": ").append(total).append(",\n");
        sb.append("  \"valid_requests\": ").append(valid).append(",\n");
        sb.append("  \"malformed_lines\": ").append(total - valid).append(",\n");
        sb.append("  \"malformed_reasons\": {\n");
        sb.append("    \"bad_format\": ").append(badFormat).append(",\n");
        sb.append("    \"invalid_ip\": ").append(invalidIp).append(",\n");
        sb.append("    \"invalid_status\": ").append(invalidStatus).append("\n");
        sb.append("  },\n");
        sb.append("  \"unique_ips\": ").append(ips.size()).append(",\n");
        appendMap(sb, "status_distribution", statuses, true);
        sb.append("  \"status_class_distribution\": {\n");
        for (int i = 0; i < 5; i++) {
            sb.append("    \"").append(i + 1).append("xx\": ").append(classes[i]);
            sb.append(i < 4 ? ",\n" : "\n");
        }
        sb.append("  },\n");
        sb.append("  \"error_count\": ").append(errorCount).append(",\n");
        sb.append("  \"error_rate\": ").append(formatRate(errorCount, valid)).append(",\n");
        sb.append("  \"total_bytes\": ").append(totalBytes).append(",\n");
        int top = Math.min(3, sorted.size());
        if (top == 0) {
            sb.append("  \"top_ips\": [],\n");
        } else {
            sb.append("  \"top_ips\": [\n");
            for (int i = 0; i < top; i++) {
                sb.append("    {\n");
                sb.append("      \"ip\": \"").append(sorted.get(i).getKey()).append("\",\n");
                sb.append("      \"count\": ").append(sorted.get(i).getValue()).append("\n");
                sb.append(i < top - 1 ? "    },\n" : "    }\n");
            }
            sb.append("  ],\n");
        }
        appendMap(sb, "methods", methods, false);
        sb.append("}\n");
        return sb.toString();
    }

    private static <K> void appendMap(StringBuilder sb, String name, Map<K, Long> map, boolean comma) {
        if (map.isEmpty()) {
            sb.append("  \"").append(name).append("\": {}").append(comma ? ",\n" : "\n");
            return;
        }
        sb.append("  \"").append(name).append("\": {\n");
        int i = 0;
        for (Map.Entry<K, Long> e : map.entrySet()) {
            sb.append("    \"").append(e.getKey()).append("\": ").append(e.getValue());
            sb.append(++i < map.size() ? ",\n" : "\n");
        }
        sb.append("  }").append(comma ? ",\n" : "\n");
    }

    /** Convenience for tests: analyze a whole string. */
    public static String analyzeToJson(String text) {
        LogAnalyzer a = new LogAnalyzer();
        for (String piece : text.split("\n", -1)) {
            a.feed(piece);
        }
        return a.toCanonicalJson();
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("usage: java LogAnalyzer <logfile>");
            System.exit(2);
        }
        LogAnalyzer a = new LogAnalyzer();
        try (InputStream in = new BufferedInputStream(Files.newInputStream(Paths.get(args[0])), 1 << 20)) {
            ByteArrayOutputStream line = new ByteArrayOutputStream(256);
            int b;
            while ((b = in.read()) != -1) {
                if (b == '\n') {
                    a.feed(new String(line.toByteArray(), StandardCharsets.UTF_8));
                    line.reset();
                } else {
                    line.write(b);
                }
            }
            if (line.size() > 0) {
                a.feed(new String(line.toByteArray(), StandardCharsets.UTF_8));
            }
        } catch (IOException e) {
            System.err.println("cannot read " + args[0] + ": " + e.getMessage());
            System.exit(1);
        }
        System.out.print(a.toCanonicalJson());
        System.out.flush();
    }
}

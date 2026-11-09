import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Shared-fixture tests for the Java implementation (no JUnit needed).
 *
 * Build and run from multi_language_code_generator/:
 *   javac -d build/java implementations/java/LogAnalyzer.java tests/java/LogAnalyzerTest.java
 *   java -cp build/java LogAnalyzerTest tests/fixtures
 */
public class LogAnalyzerTest {
    private static int passed = 0;
    private static int failed = 0;

    private static void check(String name, boolean ok) {
        if (ok) {
            passed++;
            System.out.println("ok     " + name);
        } else {
            failed++;
            System.out.println("FAILED " + name);
        }
    }

    public static void main(String[] args) throws IOException {
        Path fixtures = Paths.get(args.length > 0 ? args[0] : "tests/fixtures");
        List<String> names = new ArrayList<>();
        try (DirectoryStream<Path> ds = Files.newDirectoryStream(fixtures, "*.log")) {
            for (Path p : ds) {
                String f = p.getFileName().toString();
                names.add(f.substring(0, f.length() - 4));
            }
        }
        Collections.sort(names);
        check("at least twelve shared cases", names.size() >= 12);

        for (String name : names) {
            byte[] log = Files.readAllBytes(fixtures.resolve(name + ".log"));
            byte[] expected = Files.readAllBytes(fixtures.resolve(name + ".expected.json"));
            String actual = LogAnalyzer.analyzeToJson(new String(log, StandardCharsets.UTF_8));
            check("api output matches expected bytes: " + name,
                java.util.Arrays.equals(actual.getBytes(StandardCharsets.UTF_8), expected));
        }

        check("ip validation accepts 255.255.255.255", LogAnalyzer.isValidIp("255.255.255.255"));
        check("ip validation rejects 256.0.0.1", !LogAnalyzer.isValidIp("256.0.0.1"));
        check("ip validation rejects 1.2.3", !LogAnalyzer.isValidIp("1.2.3"));
        check("ip order is numeric", LogAnalyzer.ipCompare("10.0.0.9", "10.0.0.10") < 0);
        check("rate 1/32 rounds half up to 0.0313", LogAnalyzer.formatRate(1, 32).equals("0.0313"));
        check("rate 2/3 is 0.6667", LogAnalyzer.formatRate(2, 3).equals("0.6667"));
        check("rate 5/5 prints 1", LogAnalyzer.formatRate(5, 5).equals("1"));
        check("rate with no requests prints 0", LogAnalyzer.formatRate(0, 0).equals("0"));
        check("rate 1/10000 prints 0.0001", LogAnalyzer.formatRate(1, 10000).equals("0.0001"));

        System.out.println(passed + " passed, " + failed + " failed");
        if (failed > 0) {
            System.exit(1);
        }
    }
}

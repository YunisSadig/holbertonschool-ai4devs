// Tests asserting the INTENDED behaviour of bug5.java and bug6.java.
// Expected to FAIL against the buggy originals.
// Run (from smart_bug_bounty/): javac -d out bug_snippets/bug5.java bug_snippets/bug6.java tests/BugTests.java
//                               java -cp out BugTests
import java.util.Arrays;

public class BugTests {
    static int failures = 0;

    static void check(String name, Object expected, Object actual) {
        boolean ok = expected.equals(actual);
        System.out.println((ok ? "PASS " : "FAIL ") + name + " expected=" + expected + " actual=" + actual);
        if (!ok) failures++;
    }

    public static void main(String[] args) {
        check("bug5 literal admin", true, bug5.isAdmin("admin"));
        check("bug5 parsed admin", true, bug5.isAdmin(bug5.roleFromInput("role=admin")));
        check("bug5 new String admin", true, bug5.isAdmin(new String("admin")));
        check("bug5 user is not admin", false, bug5.isAdmin("user"));
        check("bug6 window 2", Arrays.toString(new double[]{1.5, 2.5, 3.5}),
              Arrays.toString(bug6.movingAverage(new int[]{1, 2, 3, 4}, 2)));
        check("bug6 window equals length", Arrays.toString(new double[]{2.5}),
              Arrays.toString(bug6.movingAverage(new int[]{2, 3}, 2)));
        check("bug6 window too big", Arrays.toString(new double[0]),
              Arrays.toString(bug6.movingAverage(new int[]{1}, 3)));
        System.out.println(failures + " failure(s)");
        System.exit(failures == 0 ? 0 : 1);
    }
}

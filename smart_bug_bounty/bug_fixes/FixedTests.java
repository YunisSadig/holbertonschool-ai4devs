// Tests asserting the INTENDED behaviour of bug5_fixed.java and bug6_fixed.java.
// Expected to PASS against the fixed versions.
// Run (from smart_bug_bounty/): javac -d out bug_fixes/bug5_fixed.java bug_fixes/bug6_fixed.java bug_fixes/FixedTests.java
//                               java -cp out FixedTests
import java.util.Arrays;

public class FixedTests {
    static int failures = 0;

    static void check(String name, Object expected, Object actual) {
        boolean ok = expected.equals(actual);
        System.out.println((ok ? "PASS " : "FAIL ") + name + " expected=" + expected + " actual=" + actual);
        if (!ok) failures++;
    }

    public static void main(String[] args) {
        check("bug5_fixed literal admin", true, bug5_fixed.isAdmin("admin"));
        check("bug5_fixed parsed admin", true, bug5_fixed.isAdmin(bug5_fixed.roleFromInput("role=admin")));
        check("bug5_fixed new String admin", true, bug5_fixed.isAdmin(new String("admin")));
        check("bug5_fixed user is not admin", false, bug5_fixed.isAdmin("user"));
        check("bug6_fixed window 2", Arrays.toString(new double[]{1.5, 2.5, 3.5}),
              Arrays.toString(bug6_fixed.movingAverage(new int[]{1, 2, 3, 4}, 2)));
        check("bug6_fixed window equals length", Arrays.toString(new double[]{2.5}),
              Arrays.toString(bug6_fixed.movingAverage(new int[]{2, 3}, 2)));
        check("bug6_fixed window too big", Arrays.toString(new double[0]),
              Arrays.toString(bug6_fixed.movingAverage(new int[]{1}, 3)));
        System.out.println(failures + " failure(s)");
        System.exit(failures == 0 ? 0 : 1);
    }
}

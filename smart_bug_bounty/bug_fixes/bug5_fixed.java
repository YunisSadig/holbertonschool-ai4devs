// Login helper: decide whether a user is an administrator (fixed).
public class bug5_fixed {
    static final String ADMIN_ROLE = "admin";

    // True when the role equals "admin" (case-sensitive, text comparison, null-safe).
    static boolean isAdmin(String role) {
        return ADMIN_ROLE.equals(role);
    }

    // Roles often come from parsed input, so they are not interned literals.
    static String roleFromInput(String line) {
        return line.substring(line.indexOf('=') + 1).trim();
    }

    public static void main(String[] args) {
        System.out.println(isAdmin("admin"));                       // true
        System.out.println(isAdmin(roleFromInput("role=admin")));   // true
        System.out.println(isAdmin(new String("admin")));           // true
    }
}

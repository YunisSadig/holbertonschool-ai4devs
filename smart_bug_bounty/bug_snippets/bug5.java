// Login helper: decide whether a user is an administrator.
public class bug5 {
    static final String ADMIN_ROLE = "admin";

    // Intended: true when the role equals "admin" (case-sensitive, text comparison).
    static boolean isAdmin(String role) {
        return role == ADMIN_ROLE;
    }

    // Roles often come from parsed input, so they are not interned literals.
    static String roleFromInput(String line) {
        return line.substring(line.indexOf('=') + 1).trim();
    }

    public static void main(String[] args) {
        System.out.println(isAdmin("admin"));                       // true (same interned literal)
        System.out.println(isAdmin(roleFromInput("role=admin")));   // intended: true
        System.out.println(isAdmin(new String("admin")));           // intended: true
    }
}

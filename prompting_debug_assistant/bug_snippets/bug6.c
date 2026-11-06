/* Bug 6: validate a user-entered confirmation word. */
#include <stdio.h>
#include <string.h>

int is_confirmed(const char *entered) {
    const char *expected = "CONFIRM";
    if (entered == expected) {
        return 1;
    }
    return 0;
}

int main(void) {
    char input[32];
    printf("Type CONFIRM to proceed: ");

    if (fgets(input, sizeof(input), stdin) == NULL) {
        return 1;
    }
    input[strcspn(input, "\n")] = '\0';

    if (is_confirmed(input)) {
        puts("Action confirmed");
    } else {
        puts("Action rejected");
    }
    return 0;
}

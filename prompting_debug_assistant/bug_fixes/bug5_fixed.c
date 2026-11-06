/* Bug 5: calculate the percentage of completed assignments. */
#include <stdio.h>

double completion_percentage(int completed, int assigned) {
    if (assigned <= 0 || completed < 0 || completed > assigned) {
        return -1.0;
    }

    /* BUG: integer division truncates the fractional ratio. */
    double percentage = ((double)completed / assigned) * 100.0;
    return percentage;
}

int main(void) {
    int completed = 3;
    int assigned = 4;

    printf("Completed: %d of %d\n", completed, assigned);
    printf("Completion: %.1f%%\n", completion_percentage(completed, assigned));
    return 0;
}

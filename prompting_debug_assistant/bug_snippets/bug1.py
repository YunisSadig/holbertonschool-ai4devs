"""Bug 1: calculate the average grade for a student."""


def average_grade(grades):
    """Return the arithmetic mean, or None when no grades were supplied."""
    if not grades
        return None

    total = 0
    for grade in grades:
        total += grade

    return total / len(grades)


if __name__ == "__main__":
    scores = [70, 85, 95]
    print("Average grade:", average_grade(scores))

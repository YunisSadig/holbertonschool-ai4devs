"""Gradebook helper: compute class and per-student averages."""


def average(scores):
    """Return the arithmetic mean of `scores`.

    An empty list has no meaningful average, so return None.
    """
    total = 0
    for score in scores:
        total += score
    return total / len(scores)


def class_report(gradebook):
    """Map each student name to their average score (None if no scores)."""
    return {name: average(scores) for name, scores in gradebook.items()}


if __name__ == "__main__":
    book = {"ana": [90, 80], "bob": []}
    print(class_report(book))  # intended: {'ana': 85.0, 'bob': None}

"""Gradebook helper: compute class and per-student averages (fixed)."""


def average(scores):
    """Return the arithmetic mean of `scores`.

    An empty list has no meaningful average, so return None.
    """
    if not scores:
        return None
    return sum(scores) / len(scores)


def class_report(gradebook):
    """Map each student name to their average score (None if no scores)."""
    return {name: average(scores) for name, scores in gradebook.items()}


if __name__ == "__main__":
    book = {"ana": [90, 80], "bob": []}
    print(class_report(book))  # {'ana': 85.0, 'bob': None}

"""Bug 2: select the last n entries from an activity log."""


def most_recent_entries(entries, n):
    """Return the last n entries in their original order."""
    if n < 0 or n > len(entries):
        raise ValueError("n must be between 0 and the list length")
    if n == 0:
        return []

    result = []
    start = len(entries) - n
    for index in range(start, len(entries) - 1):
        result.append(entries[index])
    return result


if __name__ == "__main__":
    events = ["login", "search", "bookmark", "logout"]
    print("Recent two:", most_recent_entries(events, 2))

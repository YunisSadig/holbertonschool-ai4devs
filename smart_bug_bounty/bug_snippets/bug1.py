"""Activity feed helper: return the most recent items of a feed."""


def last_n_items(items, n):
    """Return the last n items of `items`, oldest first.

    If n is larger than the list, return all items.
    If n is 0 or negative, return an empty list.
    """
    if n <= 0:
        return []
    return items[len(items) - n + 1:]


def latest_titles(feed, n):
    """Return the titles of the last n feed entries."""
    return [entry["title"] for entry in last_n_items(feed, n)]


if __name__ == "__main__":
    feed = [{"title": t} for t in ["a", "b", "c", "d", "e"]]
    print(latest_titles(feed, 3))  # intended: ['c', 'd', 'e']

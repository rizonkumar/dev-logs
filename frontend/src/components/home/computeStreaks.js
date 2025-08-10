export function computeStreaksFromLogs(logs) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const toUtcYyyyMmDd = (date) => {
    const d = new Date(date);
    const utc = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    return utc.toISOString().slice(0, 10);
  };

  const dateSet = new Set(logs.map((l) => toUtcYyyyMmDd(l.date)));
  const sortedDays = Array.from(dateSet).sort();

  let longest = 0;
  let run = 0;
  let prev = null;
  for (const dayStr of sortedDays) {
    const cur = new Date(dayStr + "T00:00:00.000Z");
    if (prev) {
      const diffDays = Math.round((cur - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        run += 1;
      } else {
        longest = Math.max(longest, run);
        run = 1;
      }
    } else {
      run = 1;
    }
    prev = cur;
  }
  longest = Math.max(longest, run);

  let current = 0;
  if (sortedDays.length > 0) {
    const cursor = new Date(
      sortedDays[sortedDays.length - 1] + "T00:00:00.000Z"
    );
    while (dateSet.has(cursor.toISOString().slice(0, 10))) {
      current += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
  }

  return { currentStreak: current, longestStreak: longest };
}

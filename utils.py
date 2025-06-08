from datetime import datetime, timedelta

def to_minutes(t: str) -> int:
    dt = datetime.strptime(t, "%H:%M")
    return dt.hour * 60 + dt.minute

def to_time(m: int) -> str:
    h = m // 60
    mins = m % 60
    return f"{h:02}:{mins:02}"

def merge_intervals(intervals):
    intervals.sort()
    merged = []
    for start, end in intervals:
        if not merged or merged[-1][1] < start:
            merged.append([start, end])
        else:
            merged[-1][1] = max(merged[-1][1], end)
    return merged

def invert_busy(busy, work_start=540, work_end=1080):
    free = []
    prev = work_start
    for start, end in busy:
        if start > prev:
            free.append([prev, start])
        prev = max(prev, end)
    if prev < work_end:
        free.append([prev, work_end])
    return free

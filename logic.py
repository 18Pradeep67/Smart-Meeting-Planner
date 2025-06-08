from storage import user_busy_slots, booked_slots
from utils import to_minutes, to_time, merge_intervals, invert_busy

def find_common_free_slots(duration: int):
    all_busy = []
    for slots in user_busy_slots.values():
        for start, end in slots:
            all_busy.append([to_minutes(start), to_minutes(end)])
    for start, end in booked_slots:
        all_busy.append([to_minutes(start), to_minutes(end)])

    merged_busy = merge_intervals(all_busy)
    free_slots = invert_busy(merged_busy)

    result = []
    for start, end in free_slots:
        if end - start >= duration:
            result.append([to_time(start), to_time(end)])
        if len(result) == 3:
            break
    return result


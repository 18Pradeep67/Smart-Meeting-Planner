from fastapi import FastAPI, HTTPException
from models import Slots, Booking
from storage import user_busy_slots, booked_slots
from logic import find_common_free_slots
from fastapi import Path, Query, HTTPException
from utils import to_minutes, to_time
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:5173"] for stricter rules
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/slots")
def save_slots(slots: Slots):
    for user in slots.users:
        user_busy_slots[user.id] = user.busy
    return {"status": "saved"}

@app.get("/suggest")
def suggest_slots(duration: int = Query(...)):
    return find_common_free_slots(duration)

@app.get("/calendar/{user_id}")
def calendar(user_id: int = Path(...)):
    return {
        "busy": user_busy_slots.get(user_id, []),
        "booked": booked_slots
    }

@app.post("/book")
def book_slot(booking: Booking, duration: int = Query(...)):
    start_time = booking.slot[0]
    end_time = booking.slot[1]
    start_min = to_minutes(start_time)
    end_min = to_minutes(end_time)

    if end_min - start_min != duration:
        raise HTTPException(status_code=400, detail="Invalid duration")

    available_slots = find_common_free_slots(duration)

    # Check if booking lies within ANY of the free slots
    is_within = False
    for free in available_slots:
        free_start = to_minutes(free[0])
        free_end = to_minutes(free[1])
        if start_min >= free_start and end_min <= free_end:
            is_within = True
            break

    if not is_within:
        raise HTTPException(status_code=400, detail="Slot not available")

    # Add to booked slots
    booked_slots.append([start_time, end_time])

    # Update all users' busy slots
    for user_id in user_busy_slots:
        user_busy_slots[user_id].append([start_time, end_time])

    return {"status": "booked", "slot": [start_time, end_time]}


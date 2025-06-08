from pydantic import BaseModel
from typing import List

class User(BaseModel):
    id: int
    busy: List[List[str]]

class Slots(BaseModel):
    users: List[User]

class Booking(BaseModel):
    slot: List[str]  # ["14:00", "15:00"]
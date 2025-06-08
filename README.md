# Scheduling App with FastAPI Backend and React Frontend

This project is a simple scheduling system that allows users to:

- Submit their busy time slots
- Get suggestions for common free time slots across multiple users
- Book partial or full time slots dynamically
- View booked and busy slots on a calendar

---

## Features

### Backend (FastAPI)
- **POST /slots**: Save busy slots for users
- **GET /suggest?duration=XX**: Get common free slots of specified duration (in minutes)
- **GET /calendar/{user_id}**: Get busy and booked slots for a user
- **POST /book?duration=XX**: Book a partial or full slot for the specified duration

Includes CORS middleware to allow frontend requests.

---

### Frontend (React + TypeScript)

- Suggest available slots with customizable duration
- Display suggestions in a table with duration and booking buttons
- Book partial slots within available larger slots
- Show confirmation modal on booking
- Display error messages on API failures
- Calendar view integration to visualize busy/booked slots

Uses [lucide-react](https://lucide.dev/) for icons.

---

## Setup Instructions

### Backend

1. Clone the repo and navigate to backend folder (if separate).

2. Install dependencies:

```bash
pip install fastapi uvicorn
```
3. Run the FastAPI server:
```bash
uvicorn main:app --reload
```
4. Backend will run on ```http://127.0.0.1:8000``` by default.

### Frontend

1. Navigate to frontend folder.
2. Install dependencies (assuming use of npm or yarn):
```bash
npm install
```
or
```bash
yarn install
```
3. Start the React development server:
```bash
npm run dev
```
or
```bash
yarn dev
```
4. Frontend runs on http://localhost:5173 (or configured port).


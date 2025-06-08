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
pip install -r requirements.txt
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

### Two short reflections
1. I used ChatGPT to help me with debugging, finding out and understanding the logical errors and design suggestions.

   **Successes**
     * Got solutions to tricky partial slot booking logic.
     * Resolved API call issues and error handling with precise suggestions.
  
   **Challenges**
     * Needed manual fixes for some AI-generated code snippets.
     * Handling user feedback or edge cases sometimes required extra testing beyond AI’s first output.
I used bolt.new for generating the frontend. I chose not to spend much time on frontend, as it was required to be minimal and since frontend is not graded, I decided not to put much effort and time on that. Therefore I just asked bolt.new to generate frontend for me. I downloaded the folder that bolt generated and made some changes in the logic of integration with the API such that it is consistent with the format of my API.

   **Prompts**
   
   
       I want a beautiful page with 3 tabs on the navbar: Post slots, suggest, calendar   
  
          In post slots    
          ○ Textarea to paste the JSON input for /slots    
          
          In suggest   
          ○ “Suggest” button that calls /suggest   
          ○ Table displaying the resulting free windows   
      
          A button book should be displayed, after that we should be able to select an option out of all the displayed results   
          My api returns results of /suggest call like this:   
          [["10:30","11:00"],["12:00","13:00"],["14:00","15:00"]]
              
          After choosing one of these options, I should be able to get a pop up like booked or some confirmation    
          
          Calendar tab:-   
          I should be able to select a user id   
          My api returns this:    
          {"busy": [["09:00","10:30"],["13:00","14:00"]],"booked": []}
   
          /slots and /suggest and /calendar/<id> are api calls that I had already written

   **Successes**
   * It generated a really good looking, responsive UI which is user friendly within 3-5 mins.
   * I absolutely had to write 0 frontend code for design.
   * It was easy to understand and make changes for integration as it is structured properly.

   **Challenges**
   * Mostly, there were no challenges, as the project was structured properly. I could easily find where the integration code was. I just had to make sure the ```API_URL``` was correct, all the paths were called correctly, and that the calls were made in the correct format. Once I double-checked these, all I had to do was press the buttons on the website, and everything worked as expected.   
   
3. If given two more days, I would focus on refactoring and enhancing the backend API to make it more robust and scalable. This includes adding comprehensive validation, better error handling, and detailed logging to track issues more effectively. I would also add more features like user authentication, slot cancellation, and conflict resolution to make the booking system more complete. Additionally, I’d write automated tests for API endpoints to ensure reliability and ease future maintenance.
      

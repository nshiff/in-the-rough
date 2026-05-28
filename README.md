# In The Rough

Most job search tools match you to roles the same way an ATS rejects you — by scanning for keywords. **In The Rough** is different. Upload your resume, and our AI reads it the way a great recruiter would: understanding your career trajectory, recognizing the technologies that travel together, and sensing the shape of the career you're building. 

The result is a shortlist of roles that actually fit, surfaced from thousands of listings before you ever open a single job description. Less scrolling. More signal.

## Architecture

This project is separated into a frontend and a backend:
- **`app/`**: A React application built with TypeScript and Vite. Features a premium light-mode design with smooth animations.
- **`api/`**: A Python FastAPI backend handling resume parsing and AI integrations.

## Getting Started

To run the application locally, you will need to start both the frontend and backend servers.

### 1. Start the Backend API

Navigate to the `api` directory, activate the virtual environment, and start the FastAPI server:

```bash
cd api
source venv/bin/activate
# Install requirements if you haven't already: pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000` (and the Swagger docs at `http://127.0.0.1:8000/docs`).

### 2. Start the Frontend Application

In a new terminal window, navigate to the `app` directory, install dependencies, and start the Vite dev server:

```bash
cd app
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

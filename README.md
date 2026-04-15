# MERN Notes App (NoteCraft)

A basic CRUD notes app on the MERN stack with:
- Landing page
- Sign up / Sign in
- Notes creation + viewing page for each authenticated user
- Profile page
- Semantic-search-ready note schema (title/content embedding field)

## Project Structure

- backend/ - Express + MongoDB API
- frontend/ - React (Vite) web app

## Backend Setup

1. Open a terminal in backend/
2. Install dependencies:
   npm install
3. Create .env from .env.example and update values:
   - MONGO_URI
   - JWT_SECRET
   - CLIENT_URL
4. Run backend:
   npm run dev

## Frontend Setup

1. Open a terminal in frontend/
2. Install dependencies:
   npm install
3. Run frontend:
   npm run dev

Frontend runs on http://localhost:5173, backend on http://localhost:5000.

## API Highlights

- POST /api/auth/signup
- POST /api/auth/signin
- GET /api/auth/me
- GET /api/users/profile
- POST /api/notes
- GET /api/notes
- GET /api/notes?q=your+semantic+query
- PUT /api/notes/:id
- DELETE /api/notes/:id

## Semantic Search Readiness

The note model stores an embedding vector for each note and updates it whenever title/content changes. Current search endpoint computes cosine similarity against stored embeddings and ranks user notes.

You can later replace this embedding utility with a production embedding model and vector index without changing the API contract.

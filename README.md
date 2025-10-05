# ai-task-helper
"AI-powered Habit Tracker/TODO app with NLP parsing using Hugging Face. Full-stack: Next.js + Node/Express + MongoDB.
# AI Task Helper

AI-powered TODO/Habit Tracker with NLP for natural language commands (e.g., "Add run tomorrow at 7am").

## Tech Stack
- **Frontend**: Next.js (React), Redux Toolkit, SCSS, React Hook Form
- **Backend**: Node.js/Express, MongoDB (Mongoose), JWT Auth, Socket.io
- **AI**: Hugging Face Inference API for NLP parsing
- **Deploy**: Docker, Vercel (FE), Railway (BE)

## Features
- NLP task creation
- Real-time updates
- Auth & Dashboard

## Setup
1. Clone repo
2. Backend: `cd backend && npm install && docker-compose up -d` (for Mongo)
3. Frontend: `cd frontend && npm install && npm run dev`
4. Env: Add .env with HF_TOKEN, MONGO_URI, JWT_SECRET

Demo: [GIF/Video link]

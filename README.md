# VoteRight AI

VoteRight AI is a modern, AI-powered civic guidance platform designed for Indian voters. It provides simple, interactive, accessible, and personalized guidance on election processes.

## Problem Statement
Many citizens, especially first-time voters, find the election process confusing. They struggle with eligibility, registration (Form 6), understanding EPIC, polling procedures, and checking their readiness. 

## Target Users
- First-time voters
- Young Indian citizens
- Users needing guidance on voter registration and updating voter information
- Users unfamiliar with polling processes (EVM, VVPAT)

## Architecture Overview
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Zustand
- **Backend**: Node.js + Express
- **AI**: Google Gemini API via Backend
- **Database**: Firebase Firestore
- **Auth**: Firebase Anonymous Authentication
- **Deployment**: Firebase Hosting (Frontend), Render (Backend)

```
User → React Frontend → Express Backend → Gemini API → Firestore
```

## Setup Instructions

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. `cd backend`
2. `npm install`
3. Set up `.env` based on `.env.example`.
4. `npm run dev`

## AI Workflow
The frontend communicates entirely with the backend. The backend securely communicates with the Gemini API, orchestrating prompts with Indian election context, handling user state, and enforcing rate limits.

## Accessibility Considerations
The platform supports keyboard navigation, proper ARIA labels, screen reader compatibility, visible focus indicators, and high contrast aesthetics.

## Google Services Integration
- Google Gemini API (for AI responses)
- Firebase Firestore & Auth (for state persistence and anonymous sessions)

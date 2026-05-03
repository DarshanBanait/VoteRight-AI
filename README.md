# VoteRight AI

VoteRight AI is a modern, AI-powered civic guidance platform designed for Indian voters. It provides simple, interactive, accessible, and personalized guidance on election processes.

 **Live Web App:** [https://voteright-ai.web.app/](https://voteright-ai.web.app/)

##  Chosen Vertical
**Civic Technology & Voter Education.** We focused on the intersection of AI and civic duty, specifically tackling the drop-off in voter participation caused by bureaucratic friction and lack of accessible information.

##  Approach and Logic
- **Micro-Learning:** Instead of overwhelming the user with a static FAQ wall, we break complex topics into interactive "Floating Bubbles."
- **Gamified Preparedness:** Rather than just telling users what to do, we ask them a series of questions (the Readiness Checker) and score their preparedness in real-time.
- **Bounded AI:** We leverage Google's Gemini LLM not as an open-ended chatbot, but as a tightly-prompted engine that serves two strict purposes: explaining specific topics simply, and generating structured JSON action plans.
- **Frictionless Onboarding:** By utilizing Anonymous Authentication, we remove the massive barrier-to-entry of requiring an email/password signup, while still offering the benefits of a personalized, state-persistent application.

##  How the Solution Works
1. **Interactive Guidance:** Users interact with topic bubbles on the frontend. This triggers the Express backend to securely ping the Gemini API, returning a contextual, 2-3 sentence explanation of the topic. If the user finds the explanation too complex, they can click "Explain Simply" to trigger a secondary AI prompt that simplifies the language.
2. **Readiness Evaluation:** Users complete a 7-step interactive checklist regarding their voter status (e.g., Form 6, Polling Booth verification).
3. **Personalized Roadmap:** The frontend sends the user's checklist answers to the backend. The backend uses a highly structured prompt to command Gemini to generate a custom, step-by-step JSON roadmap tailored exclusively to the user's missing requirements.
4. **State Persistence:** Firebase Anonymous Auth silently ties the user's browser session to a Firestore document, ensuring their generated roadmap and score persist even if they refresh the page.

##  Assumptions Made
- **Reliable Internet:** We assumed users will have a stable internet connection, opting to rely entirely on live API calls rather than building an offline, hardcoded RAG database fallback.
- **AI Knowledge Cutoff:** We assumed the base knowledge of the Google Gemini 2.5 Flash model is sufficient and accurate enough regarding standard Indian Electoral rules (ECI guidelines) to not require constant fine-tuning.
- **Privacy Over Persistence:** We assumed users value their privacy (specifically PII) over cross-device persistence. Therefore, we used Anonymous Auth, meaning a user's roadmap cannot currently be synced between their laptop and their phone.

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

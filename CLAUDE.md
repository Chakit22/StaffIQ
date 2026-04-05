# StaffIQ — Project Guidelines

## Project Overview
StaffIQ is a tutor/teaching assistant assignment platform for RMIT University. Candidates (students) apply for tutoring roles, lecturers rank and review applications, and admins manage courses and users.

## Architecture

```
StaffIQ/
├── frontend/          # Next.js 15 (Pages Router) — candidate + lecturer UI
├── backend/           # Express 5 REST API — main application logic
├── admin-backend/     # Express + Apollo Server (GraphQL) — admin operations
├── admin-dashboard/   # React 18 + Apollo Client — admin panel UI
```

### Why Two Backends?
- **REST (backend/)** — simple CRUD for candidates/lecturers with predictable request/response shapes
- **GraphQL (admin-backend/)** — admin dashboards need flexible nested queries across multiple entities; GraphQL lets the frontend request exactly what it needs in a single request

### Shared Database
All backends connect to the **same MySQL database** (`teachteam`). Both use TypeORM with the same entity definitions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, shadcn/ui, framer-motion, nuqs (URL state) |
| Backend | Express 5, TypeORM, MySQL, Zod validation, JWT auth (cookies), bcrypt |
| Admin Backend | Express 4, Apollo Server, type-graphql, TypeORM, JWT |
| Admin Dashboard | React 18, Apollo Client, React Router, recharts, Tailwind |
| AI | Google Gemini 2.5 Flash Lite via @google/generative-ai |
| Testing | Jest, Supertest (backend), Jest + Testing Library (frontend) |

## Database

- **MySQL** with TypeORM entities in `backend/src/entity/`
- Migrations in `backend/src/migration/` — run via `npm run migration:run`
- **Do NOT use `synchronize: true`** — always create migrations for schema changes
- Entity changes require a new migration file

### Key Entities
- `User` — candidates + lecturers (role field), has avatar, experiences
- `Course` — courses with course_code, many-to-many with User (LecturerCourse)
- `Application` — candidate applies to a course+role, has skills (M2M), cover_letter, resume_path, academic_creds (GPA)
- `Ranking` — composite PK (lecturerId, applicationId), stores rank number
- `Comment` — composite PK (lecturerId, applicationId), stores feedback text
- `Role` — Tutor, Lab Assistant, Marker, Teaching Assistant
- `Skill` — name as primary key
- `Availability` — Full-time, Part-time, Weekends Only, Evenings Only
- `Avatar` — profile images, one-to-many with User
- `Experience` — work history entries for candidates

## Running the Project

```bash
# Backend (REST API — port 3000)
cd backend && npm install && npm run dev

# Frontend (Next.js — port 3001)
cd frontend && npm install && npm run dev

# Admin Backend (GraphQL — port 4000)
cd admin-backend && npm install && npm run dev

# Admin Dashboard (React — port 3002)
cd admin-dashboard && npm install && npm start

# Seed database
cd backend && npm run seed

# Run migrations
cd backend && npm run migration:run
```

## Environment Variables

### backend/.env
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=Password123
DB_NAME=teachteam
JWT_SECRET=<secret>
RECAPTCHA_SECRET_KEY=<key>
GEMINI_API_KEY=<key>
```

### frontend/.env
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<key>
```

### admin-backend/.env
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=Password123
DB_NAME=teachteam
JWT_SECRET=<secret>
```

## Code Conventions

- **TypeScript** everywhere — no JavaScript files
- **2-space indentation**, trailing commas in multi-line arrays/objects
- **async/await** over callbacks
- **Zod** for request validation (backend schemas in `modules/*/schemas/`)
- **React Hook Form + Zod resolver** for frontend form validation
- Frontend schemas mirror backend schemas in `frontend/src/schemas/`
- Use shadcn/ui components — don't create custom UI primitives
- **nuqs** for URL-synced state in the frontend (filters, sort, pagination)

## Styling

- **Purple/black dark theme** — all CSS variables defined in `frontend/src/styles/globals.css`
- Primary: `#8b5cf6` (purple), Background: `#0a0a0f` (near black), Card: `#1a1a2e`
- Use theme CSS variables (`bg-primary`, `text-foreground`, `border-border`) — never hardcode colors
- framer-motion for animations — presets in `frontend/src/lib/animations.ts`
- **No emojis in code or UI** unless explicitly requested

## API Patterns

### REST (backend)
- Routes in `backend/src/modules/<feature>/<feature>.routes.ts`
- Controllers in `backend/src/modules/<feature>/controllers/`
- Middleware: `authenticateToken` → `requireLecturer`/`requireCandidate` → `validateSchema` → controller
- Response shape: `{ success: boolean, message: string, body: any }`
- Auth via httpOnly cookies (accessToken + refreshToken)

### GraphQL (admin-backend)
- Schema in `admin-backend/src/graphql/schema.ts`
- Resolvers in `admin-backend/src/graphql/resolvers/`
- Types in `admin-backend/src/graphql/types/`

## Frontend Patterns

- Pages in `frontend/src/pages/` (Next.js Pages Router)
- Components in `frontend/src/components/`
- API hooks in `frontend/src/hooks/` (useApplication, useAuth, useAI, etc.)
- Types in `frontend/src/types/`
- Context providers in `frontend/src/context/`
- Visualization components in `frontend/src/components/visualization/`

## AI Features

- Backend service: `backend/src/shared/services/gemini.service.ts`
- AI routes: `POST /api/ai/candidate-summary`, `POST /api/ai/ranking-suggestion`, `POST /api/ai/resume-insights`
- GeminiService uses lazy init — won't crash if GEMINI_API_KEY is missing (fails at call time)
- AI responses that return JSON must be cleaned of markdown code blocks before parsing

## Testing

```bash
# Backend tests
cd backend && npm test

# Run specific test
cd backend && npx jest src/__tests__/ai.test.ts --no-coverage --forceExit
```

- Backend tests in `backend/src/__tests__/`
- Tests use the real database (integration tests)
- Mock external services (GeminiService) in tests
- Always use `--forceExit` flag with Jest (Express keeps the process alive)

## Seed Data

Login: `Password@123` for all seed users.

**Lecturers:** sarah.chen@rmit.edu.au, james.wilson@rmit.edu.au, priya.sharma@rmit.edu.au
**Candidates:** 12 students (alice.johnson@student.rmit.edu.au, bob.smith@..., etc.)
**Courses:** Full Stack Development, Machine Learning, Database Concepts, Web Programming, Cloud Computing, Software Engineering

## File Upload

- Resume PDFs stored in `backend/uploads/resumes/`
- Multer middleware in `backend/src/shared/middleware/upload.middleware.ts`
- Max 5MB, PDF only
- Upload: `POST /api/applications/:id/resume`
- Download: `GET /api/applications/:id/resume`

## Common Pitfalls

- CORS is hardcoded to `http://localhost:3001` in `backend/src/index.ts` — update for production
- The `academic_creds` field stores GPA as a string (e.g., "GPA 3.8" from seed, "3.75" from form) — use regex to extract the number when sorting
- `RankingEditor.tsx` is a legacy component (unused) — `ApplicationRankingEditor.tsx` is the active one
- The graph page (`lecturer/graph.tsx`) uses stub context providers — it's legacy, `lecturer/stats.tsx` is the real analytics page
- Auth middleware returns 401 for missing/invalid/expired tokens, 500 only for unexpected errors

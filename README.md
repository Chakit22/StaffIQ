# StaffIQ

An AI-powered academic staffing platform that streamlines tutor and teaching assistant recruitment. Candidates apply with resumes, lecturers rank and review applications with AI assistance, and administrators manage courses and users through a dedicated dashboard.

## Architecture

```
StaffIQ/
├── frontend/          # Next.js 15 (Pages Router) — Candidate + Lecturer UI
├── backend/           # Express 5 REST API — Core application logic
├── admin-backend/     # Express 4 + Apollo Server — GraphQL admin API
├── admin-dashboard/   # React 18 + Apollo Client — Admin panel
```

**Why two backends?** The main backend uses REST for straightforward CRUD operations with predictable request/response shapes. The admin backend uses GraphQL because admin dashboards need flexible, nested queries across multiple entities in a single request.

All backends connect to the same MySQL database.

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, framer-motion, nuqs, @hello-pangea/dnd |
| **Backend** | Express 5, TypeORM, MySQL, Zod, JWT (httpOnly cookies), bcrypt, multer |
| **Admin Backend** | Express 4, Apollo Server, type-graphql, TypeORM |
| **Admin Dashboard** | React 18, Apollo Client, React Router, recharts, Tailwind CSS |
| **AI** | Google Gemini 2.5 Flash Lite (vision + text) via @google/generative-ai |
| **Auth** | JWT access/refresh tokens, Google reCAPTCHA v2, SheerID student verification |
| **Testing** | Jest, Supertest (backend), Playwright (E2E) |

## Key Features

### For Candidates
- **Application submission** with course/role selection, cover letter (write or upload), resume upload (PDF), skills autocomplete, and GPA
- **Application tracking** — "My Applications" tab showing status (Applied, Under Review, Shortlisted, Interview, Offered, Accepted, Rejected) with a visual progress stepper
- **Open positions** — browse available positions posted by lecturers, apply directly with pre-filled course/role
- **AI Resume Insights** — upload a resume and get an AI-generated comparison against top-ranked candidates: match score (0-100), strengths, gaps, and specific improvement suggestions
- **Resume upload** with re-upload capability; insights cache automatically clears on re-upload

### For Lecturers
- **Drag-and-drop ranking** — reorder candidates with smooth drag-and-drop instead of arrow buttons
- **AI Candidate Summary** — one-click AI assessment that reads the candidate's actual resume (PDF via Gemini Vision) + application data and generates a professional evaluation
- **AI Ranking Suggestions** — AI analyzes all selected candidates and suggests an optimal ranking order with per-candidate reasoning
- **Expandable detail view** — click any candidate card to see full cover letter, resume download, skills, GPA, availability, and inline comment editor
- **URL-synced filters** — filter by course, role, availability, skills with state persisted in the URL via nuqs
- **Sort options** — sort by name, course, role, or GPA
- **Statistics dashboard** — consensus table showing how all lecturers ranked each candidate, comparison view for side-by-side evaluation, pie/bar charts for role/availability/ranking distribution, CSV export

### For Admins
- **Course management** — CRUD operations for courses
- **Lecturer assignment** — assign lecturers to courses
- **User management** — block/unblock users
- **Reports** — candidates per course, multi-course candidates, unassigned candidates
- **Position management** — GraphQL API for creating and managing open positions

### AI Features (Gemini 2.5 Flash Lite)
- **Resume parsing via Vision API** — Gemini reads uploaded PDFs visually, supporting both text-based and image-based resumes (Canva exports, scanned documents)
- **Candidate summary** — holistic assessment based on resume + application data
- **Ranking suggestions** — multi-candidate comparison with reasoning
- **Resume insights** — comparative analysis against successful candidates with strict scoring rubric

### Security
- JWT authentication with httpOnly cookies (access + refresh tokens)
- Google reCAPTCHA v2 on login/register (with `SKIP_CAPTCHA` dev bypass)
- SheerID student verification for candidates (with `SKIP_VERIFICATION` dev bypass)
- Zod schema validation on all API inputs
- bcrypt password hashing
- Role-based access control (candidate/lecturer/admin)
- CORS configuration
- No plaintext password logging

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- Google reCAPTCHA keys (register at https://www.google.com/recaptcha/admin)
- Google Gemini API key (from https://aistudio.google.com/apikey)

### 1. Database Setup
```sql
CREATE DATABASE staffiq;
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=staffiq
JWT_SECRET=your_jwt_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
GEMINI_API_KEY=your_gemini_key
SKIP_CAPTCHA=true
SKIP_VERIFICATION=true
EOF

# Run migrations and seed
npm run migration:run
npm run seed

# Start dev server (port 3000)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key" > .env

# Start dev server (port 3001)
npm run dev
```

### 4. Admin Backend Setup
```bash
cd admin-backend
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=staffiq
JWT_SECRET=your_jwt_secret
EOF

# Start dev server (port 4000)
npm run dev
```

### 5. Admin Dashboard Setup
```bash
cd admin-dashboard
npm install

# Start dev server (port 3002)
npm start
```

## Seed Data

All seed users use password: `Password@123`

**Lecturers:**
| Name | Email | Courses |
|---|---|---|
| Dr. Sarah Chen | sarah.chen@rmit.edu.au | Full Stack Development, Machine Learning, Web Programming |
| Prof. James Wilson | james.wilson@rmit.edu.au | Database Concepts, Cloud Computing, Software Engineering |
| Dr. Priya Sharma | priya.sharma@rmit.edu.au | Full Stack Development, Database Concepts, Cloud Computing |

**Candidates:** 12 students (alice.johnson@student.rmit.edu.au, bob.smith@student.rmit.edu.au, etc.)

**Courses:** Full Stack Development, Machine Learning, Database Concepts, Web Programming, Cloud Computing, Software Engineering

**Open Positions:** 8 positions across all courses with various roles and deadlines

**Admin:** username: `admin`, password: `admin`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh-token` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/verify-student` | Start SheerID verification |
| GET | `/api/auth/verification-status/:id` | Check verification status |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Create application (candidate) |
| GET | `/api/applications` | Get all applications (lecturer) |
| GET | `/api/applications/my` | Get own applications (candidate) |
| PATCH | `/api/applications/rankings/batch` | Update rankings (lecturer) |
| GET | `/api/applications/rankings/lecturer/:id` | Get lecturer's rankings |
| DELETE | `/api/applications/rankings/:lecturerId/:applicationId` | Delete ranking |
| PUT | `/api/applications/comment` | Add/update comment (lecturer) |
| POST | `/api/applications/:id/resume` | Upload resume PDF (candidate) |
| GET | `/api/applications/:id/resume` | Download resume |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/candidate-summary` | AI candidate assessment (lecturer) |
| POST | `/api/ai/ranking-suggestion` | AI ranking suggestions (lecturer) |
| POST | `/api/ai/resume-insights` | AI resume analysis (candidate) |

### Positions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/positions` | List open positions |
| GET | `/api/positions/:id` | Get position details |
| POST | `/api/positions` | Create position (lecturer) |
| PATCH | `/api/positions/:id` | Update position (lecturer) |
| PATCH | `/api/applications/:id/status` | Update application status (lecturer) |

### Other
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all courses |
| GET | `/api/roles` | List all roles |
| GET | `/api/skills` | List all skills |
| GET | `/api/availabilities` | List all availabilities |

## Design Decisions

### REST vs GraphQL
The main application uses REST because the candidate/lecturer workflows have predictable, simple request/response patterns. The admin backend uses GraphQL because admin dashboards need to query across multiple related entities (users, courses, applications, rankings) with varying field requirements — GraphQL's flexible querying avoids over-fetching.

### AI Integration
Gemini 2.5 Flash Lite was chosen for its vision capabilities (reading image-based PDFs like Canva exports), fast response times, and cost efficiency. The service uses lazy initialization — it won't crash if the API key is missing, only fails when an AI endpoint is actually called. All AI prompts include strict scoring rubrics to prevent inflated assessments.

### Authentication
JWT tokens stored in httpOnly cookies prevent XSS-based token theft. A dual-token strategy (short-lived access + long-lived refresh) balances security with UX. reCAPTCHA and SheerID add additional verification layers with dev bypasses for local development.

### URL-Synced State
Lecturer dashboard filters and sort options are stored in URL query parameters via nuqs. This enables shareable filtered views and preserves state across page refreshes.

## Project Structure

```
backend/
├── src/
│   ├── entity/              # TypeORM entities
│   ├── migration/           # Database migrations
│   ├── modules/
│   │   ├── ai/              # AI endpoints (Gemini)
│   │   ├── applications/    # Application CRUD + rankings
│   │   ├── auth/            # Authentication + verification
│   │   ├── courses/         # Course endpoints
│   │   ├── positions/       # Position management
│   │   └── ...
│   ├── shared/
│   │   ├── middleware/       # Auth, CAPTCHA, upload, validation
│   │   └── services/        # Gemini service
│   └── seed.ts              # Database seeder

frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── visualization/   # Charts, consensus table, comparison
│   ├── hooks/               # API hooks (useApplication, useAI, etc.)
│   ├── pages/               # Next.js pages
│   ├── services/            # Data services
│   ├── types/               # TypeScript types
│   └── lib/                 # Animation presets

admin-backend/
├── src/
│   ├── entities/            # TypeORM + type-graphql entities
│   └── graphql/
│       ├── resolvers/       # GraphQL resolvers
│       └── types/           # GraphQL type definitions

admin-dashboard/
├── src/
│   ├── components/          # Layout, sidebar, protected routes
│   ├── pages/               # Dashboard, courses, reports, etc.
│   └── graphQL/             # Queries and mutations
```

## License

MIT

# 🛡️ S.H.I.E.L.D.
## Superhero HERO Intelligence for Education & Life Decisions

> *"Every hero needs a mission. We give you yours."*

**Webathon · Tech Astra 2026 | Official Technical Architecture Document**

Hey create a simiple minimal authenticaion page that login and signup and used basic authentication system jwt and store the used data on the mongoDB and also pls make the landing page look simpel clean it feel like vibecoded pls drill down and amek these application look like in such a way so that it feel like we developed in 3 hours and for now

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [S.H.I.E.L.D. Theme Design System](#2-shield-theme-design-system)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [Architecture Diagram](#4-architecture-diagram)
5. [Tech Stack Justification](#5-tech-stack-justification)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend & API Layer](#7-backend--api-layer)
8. [Database Design](#8-database-design)
9. [AI Integration — Groq API](#9-ai-integration--groq-api)
10. [Data Flow — Request Lifecycle](#10-data-flow--request-lifecycle)
11. [Key Features — Technical Breakdown](#11-key-features--technical-breakdown)
12. [Scalability Considerations](#12-scalability-considerations)
13. [Security & Privacy](#13-security--privacy)
14. [Performance Optimizations](#14-performance-optimizations)
15. [Risk Assessment & Mitigations](#15-risk-assessment--mitigations)
16. [Judging Criteria Alignment](#16-judging-criteria-alignment)
17. [Demo & Storytelling Strategy](#17-demo--storytelling-strategy)
18. [Team Execution Roadmap](#18-team-execution-roadmap)
19. [Optional Enhancements](#19-optional-enhancements)
20. [Appendix](#20-appendix)

---

## 1. PROJECT OVERVIEW

### Mission Statement

> *"S.H.I.E.L.D. is a Marvel-themed AI career intelligence platform that maps a student's course to a hero archetype, then generates a classified Mission Dossier — a full career roadmap delivered as if Director Fury himself briefed you."*

### Problem Statement

Millions of students in India choose a course without understanding what careers follow. Standard resources are fragmented, generic, and dry. They Google. They panic. They settle. Students need a personalized, engaging, AI-powered career compass — not another PDF.

**S.H.I.E.L.D. solves this** by combining:
- A hero-personality quiz that assigns every student a Marvel archetype
- A cinematic hero reveal sequence (the WOW moment judges remember)
- An AI-generated classified **Mission Dossier** — career paths, skills, salaries, certifications
- A visual roadmap from Year 1 to first job
- Real salary data across Indian cities (Mumbai, Bangalore, Delhi, Tier-2)

### Why S.H.I.E.L.D. Wins

| Judging Criterion | Our Edge |
|---|---|
| Design & UI/UX (30 pts) | Cinematic Marvel dark UI — gold/red palette, classified dossier panels, glass-morphism cards. Nothing else on stage looks like this. |
| Functionality (25 pts) | Groq LLaMA-3.3-70B generates real dossiers in < 2 seconds. 5 integrated features. |
| Creativity (10 pts) | Hero-personality quiz + Mission Dossier narrative + city-wise salary heatmap = unique concept no other team attempts. |
| Responsiveness (15 pts) | Card-based layout is natively mobile-first via Tailwind. |
| Code Quality (15 pts) | Next.js 14 App Router, TypeScript throughout, Mongoose schemas, Zod validation — production-grade. |
| Theme (5 pts) | Every pixel, copy line, color, and feature references the Marvel/S.H.I.E.L.D. universe. |

### Avenger-to-Feature Mapping

| Feature | Avenger | Tagline |
|---|---|---|
| AI Mission Dossier | **Iron Man / JARVIS** | "Genius-level career intelligence" |
| Hero Reveal Sequence | **Nick Fury** | "Agent identified. Mission begins now." |
| Visual Roadmap | **Captain America** | "I can do this all day — follow the path" |
| Salary Heatmap | **Black Widow** | "Follow the money trail" |
| Career Quiz | **Thor** | "Only the worthy shall find their calling" |
| Course Comparator | **Bruce Banner** | "Choose wisely before you smash" |

---

## 2. S.H.I.E.L.D. THEME DESIGN SYSTEM

### Color Palette

```css
/* S.H.I.E.L.D. Design Tokens */
--shield-black:       #0A0A0A;   /* Deep Space — primary background */
--shield-navy:        #111827;   /* Helicarrier — card backgrounds */
--shield-gold:        #F5A623;   /* Arc Reactor Gold — primary accent */
--shield-red:         #C0392B;   /* Iron Man Red — danger / action */
--shield-blue:        #2563EB;   /* Captain America — info / links */
--shield-purple:      #7C3AED;   /* Infinity Gauntlet — special */
--shield-green:       #10B981;   /* Hulk — success states */
--shield-white:       #F9FAFB;   /* Primary text */
--shield-silver:      #9CA3AF;   /* Secondary / muted text */
--shield-border:      #1F2937;   /* Subtle dark border */
--shield-amber:       #F59E0B;   /* Warning states */
```

### Typography

```css
/* Heroic heading font — bold, uppercase, wide tracking */
font-family: 'Oswald', 'Rajdhani', sans-serif;
font-weight: 700;
letter-spacing: 0.05em;
text-transform: uppercase;

/* Body — clean, legible */
font-family: 'Inter', system-ui, sans-serif;

/* Code / data */
font-family: 'JetBrains Mono', monospace;
```

### UI Component Themes

| Component | Style |
|---|---|
| Navbar | Black bg, `S.H.I.E.L.D.` logo in gold, shield icon, red-gold gradient top border |
| Hero Section | Full-screen dark + CSS particle field + glowing text: *"Assemble Your Future"* |
| Cards | Dark glass-morphism (`rgba(17,24,39,0.8)`) + gold border glow on hover |
| Primary Button | Arc Reactor gold bg, black text, shimmer animation on hover |
| Secondary Button | Captain America blue outline |
| Loading State | Arc reactor spinning SVG animation |
| Alerts | S.H.I.E.L.D. briefing-style notification panels with red left border |
| Charts | Dark bg, glowing gold/blue bars |
| Dossier Panel | "CLASSIFIED" red stamp, dark paper texture via CSS, typewriter text reveal |

### Avengers-Themed Copy

```
Search placeholder:     "Enter your course, Agent..."
AI button:              "Generate Mission Dossier"
Loading state:          "JARVIS is analyzing your future..."
Quiz title:             "Avengers Aptitude Assessment"
Salary section:         "The Infinity Earnings Scale"
Empty state:            "Even Thanos had a plan. Enter a course above."
Error message:          "The Infinity Stones are misaligned. Please retry."
Quiz result:            "Agent identified. You are Tony Stark."
Hero reveal:            "CLASSIFIED. ACCESS GRANTED."
Save button:            "File to S.H.I.E.L.D. Archive"
Share button:           "Transmit Mission Card"
```

---

## 3. SYSTEM ARCHITECTURE OVERVIEW

S.H.I.E.L.D. is a **full-stack Next.js 14 application** with three primary layers:

```
Tier 1 — Presentation:   Next.js (SSR + CSR) · React · Tailwind · Framer Motion
Tier 2 — Application:    Next.js API Routes (Edge Runtime) · Groq AI (LLaMA-3.3-70B)
Tier 3 — Data:           MongoDB Atlas · Redis (Upstash)
```

### Key Architectural Decisions

| Decision | Choice | Reason |
|---|---|---|
| Rendering | SSR + CSR hybrid | Fast first paint for judges; dynamic AI responses |
| API Layer | Next.js API Routes | Co-located, no separate server, instant Vercel deploy |
| AI Provider | Groq LLaMA-3.3-70B | Free, **< 1.8s** full dossier, 500+ tokens/sec LPU |
| Database | MongoDB Atlas (M0 free) | Flexible JSON schema, fast seed, no migrations |
| Cache | Redis via Upstash (free) | Cache AI dossiers, rate limiting, session data |
| Deployment | Vercel | Zero-config CI/CD, live URL in 90 seconds |

### Groq vs Competitors

| AI Provider | Avg Latency | UX Impact |
|---|---|---|
| **Groq LLaMA-3.3-70B** | **< 1.8s** | **Instant — feels like magic** |
| OpenAI GPT-4o | 8–12s | Loading spinner kills demo energy |
| Gemini 1.5 Flash | 3–5s | Acceptable but not wow |

---

## 4. ARCHITECTURE DIAGRAM

```
┌──────────────────────────────────────────────────────────────────────┐
│                    STUDENT BROWSER (Agent Interface)                  │
│          Next.js React App · Tailwind · Framer Motion · shadcn/ui    │
└─────────────────────────────┬────────────────────────────────────────┘
                              │  HTTPS (SSR + Streaming + Client Fetch)
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     VERCEL EDGE NETWORK (CDN)                         │
│              Static Assets · ISR Cache · Edge Middleware              │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION SERVER                          │
│                                                                        │
│  ┌──────────────┐  ┌─────────────────────┐  ┌──────────────────────┐ │
│  │  App Router   │  │    API Routes        │  │  Server Components   │ │
│  │  (Pages/UI)   │  │    (Edge Runtime)    │  │  (SSR + RSC)         │ │
│  └──────────────┘  └──────────┬──────────┘  └──────────────────────┘ │
│                                │                                        │
│     ┌──────────────────────────┼───────────────────────┐              │
│     │                          │                       │              │
│     ▼                          ▼                       ▼              │
│  /api/assess             /api/dossier            /api/courses         │
│  /api/quiz               /api/salary             /api/save            │
│  /api/compare            /api/history            /api/colleges        │
└──┬───────────────────────┬─────────────────────────┬──────────────────┘
   │                       │                         │
   ▼                       ▼                         ▼
┌──────────────┐   ┌────────────────────┐   ┌─────────────────────┐
│   GROQ API   │   │   MONGODB ATLAS    │   │   REDIS (Upstash)   │
│              │   │                    │   │                     │
│ LLaMA-3.3-   │   │  Collections:      │   │  Cache Layer:       │
│ 70B Model    │   │  · dossiers        │   │  · AI dossiers      │
│              │   │  · sessions        │   │  · Rate limits      │
│ < 1.8s avg   │   │  · courses         │   │  · Session data     │
│ 500+ tok/s   │   │  · careers         │   │  · Popular queries  │
│              │   │  · analytics       │   │                     │
│ Structured   │   │  · colleges        │   │  TTL: 24 hours      │
│ JSON output  │   │                    │   │  Free: 10K cmd/day  │
└──────────────┘   │  Free M0: 512MB   │   └─────────────────────┘
                   └────────────────────┘
```

---

## 5. TECH STACK JUSTIFICATION

### Frontend Stack

| Technology | Version | Why Chosen |
|---|---|---|
| **Next.js** | 14 (App Router) | SSR for fast first paint, co-located API routes, file-based routing, RSC |
| **React** | 18 | Component model, hooks, concurrent features, streaming |
| **Tailwind CSS** | 3.4 | Utility-first, S.H.I.E.L.D. dark theme in minutes, zero runtime CSS |
| **shadcn/ui** | Latest | Beautiful dark-mode components, saves 2+ hours of UI work |
| **Framer Motion** | 11 | Hero reveal animation, page transitions, roadmap node stagger |
| **Recharts** | 2.x | React-native charts, dark-mode compatible, salary heatmap in 5 lines |
| **html2canvas** | 1.4 | Mission card PNG export — zero dependencies, client-side |
| **Lucide React** | Latest | Icon library matching shadcn/ui system |

### Backend & Infrastructure

| Technology | Version | Why Chosen |
|---|---|---|
| **Next.js API Routes** | 14 | Edge Runtime (50ms cold start vs 800ms Node.js), co-located |
| **Groq SDK** | Latest | Free tier, LLaMA-3.3-70B, < 1.8s full dossier, structured JSON output |
| **MongoDB Atlas** | M0 Free | Flexible document schema, no migrations, Mongoose ODM |
| **Mongoose** | 8.x | Schema validation, typed queries, connection pooling |
| **Redis (Upstash)** | Serverless | AI dossier caching, rate limiting — free tier sufficient for hackathon |
| **Zod** | 3.x | Runtime input validation on all API routes |

### Deployment

| Tool | Why Chosen |
|---|---|
| **Vercel** | Zero-config deployment, instant preview URLs, Edge CDN, free SSL |
| **GitHub** | Source control, automatic Vercel CI/CD on push |
| **Vercel Analytics** | Real user monitoring, Lighthouse scores — impresses judges |

---

## 6. FRONTEND ARCHITECTURE

### Directory Structure

```
shield-career/
├── app/
│   ├── layout.tsx                ← Root: S.H.I.E.L.D. theme provider, navbar
│   ├── page.tsx                  ← Landing: Cinematic hero intro + course search
│   ├── quiz/
│   │   └── page.tsx              ← Avengers Aptitude Assessment (5 questions)
│   ├── hero/
│   │   └── [id]/
│   │       └── page.tsx          ← Hero assignment reveal with cinematic animation
│   ├── dossier/
│   │   └── page.tsx              ← S.H.I.E.L.D. Mission Dossier output
│   ├── roadmap/
│   │   └── [slug]/
│   │       └── page.tsx          ← Visual career timeline (SVG + Framer Motion)
│   ├── salary/
│   │   └── page.tsx              ← Infinity Earnings Scale (city-wise heatmap)
│   ├── compare/
│   │   └── page.tsx              ← Side-by-side career comparator
│   ├── history/
│   │   └── page.tsx              ← Saved dossiers from MongoDB
│   └── api/
│       ├── assess/route.ts       ← POST: Quiz answers → hero assignment
│       ├── dossier/route.ts      ← POST: Hero + course → Groq dossier (streaming)
│       ├── courses/route.ts      ← GET: Search + filter courses (MongoDB)
│       ├── salary/route.ts       ← GET: Salary data by career + city
│       ├── save/route.ts         ← POST: Persist dossier to MongoDB
│       ├── history/route.ts      ← GET: Fetch saved dossiers
│       └── compare/route.ts     ← GET: Side-by-side career data
│
├── components/
│   ├── ui/                       ← shadcn/ui base components
│   ├── shield/
│   │   ├── HeroSection.tsx       ← Full-screen landing, particle field, gold headline
│   │   ├── HeroReveal.tsx        ← ⭐ THE WOW MOMENT — cinematic 4-second sequence
│   │   ├── DossierPanel.tsx      ← Classified document renderer with CLASSIFIED stamp
│   │   ├── MissionCard.tsx       ← Exportable PNG share card (html2canvas target)
│   │   ├── ShieldLoader.tsx      ← Arc reactor spinning loading animation
│   │   └── AgentButton.tsx       ← Gold CTA button with shimmer hover effect
│   ├── career/
│   │   ├── CourseSearch.tsx      ← Debounced search with agent-themed autocomplete
│   │   ├── RoadmapVisualizer.tsx ← SVG animated career timeline (Avenger node icons)
│   │   ├── SalaryHeatmap.tsx     ← Recharts bar chart — city-wise salary (Indian context)
│   │   └── CareerCard.tsx        ← Glass-morphism dark career card
│   └── quiz/
│       ├── QuizEngine.tsx        ← 5-question hero personality flow (client state)
│       └── ResultsDisplay.tsx    ← Animated hero assignment + dossier CTA
│
├── lib/
│   ├── mongodb.ts                ← Connection singleton (prevents cold-start storms)
│   ├── groq.ts                   ← Groq client + prompt templates
│   ├── redis.ts                  ← Upstash Redis client
│   ├── heroAssignment.ts         ← Scoring matrix: quiz answers → hero identity
│   └── utils.ts                  ← Helpers, salary formatters, sanitizers
│
├── models/
│   ├── Dossier.ts                ← Mongoose Dossier schema
│   ├── Session.ts                ← Mongoose Session schema
│   ├── Course.ts                 ← Mongoose Course schema
│   ├── Career.ts                 ← Mongoose Career schema
│   └── Analytics.ts              ← Mongoose Analytics schema
│
├── data/
│   └── seed.ts                   ← Seed: 20+ courses, 15 careers, hero mappings
│
├── public/
│   └── shield/                   ← Theme assets (shield SVG, arc reactor, hero silhouettes)
│
└── styles/
    └── globals.css               ← Tailwind base + S.H.I.E.L.D. CSS custom properties
```

### Key Component Details

#### `HeroReveal.tsx` — ⭐ The Signature WOW Moment

> *After quiz completion, the screen goes black. A S.H.I.E.L.D. logo pulses. Then: "AGENT IDENTIFIED." The hero's silhouette animates in, CLASSIFIED stamps appear, and a typewriter effect reads: "You are Tony Stark. Your mission begins now." This 4-second sequence is the moment judges lean forward.*

```typescript
// Animation sequence (Framer Motion):
// 0.0s → Screen fades to black
// 0.5s → S.H.I.E.L.D. logo pulses in (scale 0 → 1, opacity 0 → 1)
// 1.2s → "AGENT IDENTIFIED" glows in — red, uppercase, letter-spaced
// 1.8s → Hero silhouette rises from bottom (y: 60 → 0)
// 2.2s → CLASSIFIED stamp rotates in (rotate: -15deg, opacity 0 → 1)
// 2.8s → Typewriter: "You are Tony Stark. Your mission begins now."
// 4.0s → "BEGIN MISSION" CTA button fades in — gold, pulsing
```

#### `DossierPanel.tsx` — Mission Dossier

- Dark "paper" background with CSS noise texture
- Red `CLASSIFIED` diagonal watermark stamp
- Groq response renders in structured sections with animated entrance
- Typewriter text effect as content streams in
- `MissionCard` floating button for PNG export

#### `RoadmapVisualizer.tsx` — Hero's Journey Timeline

- SVG-based interactive timeline with Framer Motion `staggerChildren`
- Avenger-themed milestone icons at each node (shield, hammer, arc reactor)
- Clickable nodes expand: skills needed, certifications, internship tips
- Color coded: Blue (studies) → Gold (skills) → Green (career achieved)
- HEROtal scroll on mobile, full-width on desktop

#### `SalaryHeatmap.tsx` — Infinity Earnings Scale

- Recharts `BarChart` with S.H.I.E.L.D. dark theme
- X-axis: Cities (Mumbai, Bangalore, Delhi, Pune, Hyderabad, Tier-2)
- Y-axis: Annual salary in lakhs (₹ LPA)
- Gold bars, blue hover highlight
- Tooltip: min / median / max on hover

---

## 7. BACKEND & API LAYER

All routes run on **Vercel's Edge Runtime** — 50ms cold start vs 800ms for Node.js serverless.

### `POST /api/assess` — Hero Assignment

```typescript
// Request
{ answers: QuizAnswer[] }  // 5 answers from Avengers Aptitude Assessment

// Logic
// Weighted scoring matrix maps answer combinations to hero identities:
// curiosity + analytical       → Tony Stark / Iron Man
// leadership + strategy        → T'Challa / Black Panther
// resilience + sacrifice       → Steve Rogers / Captain America
// wisdom + mystical            → Doctor Strange
// raw power + heart            → Thor
// adaptability + stealth       → Natasha Romanoff / Black Widow
// healing + compassion         → Bruce Banner / Hulk

// Response
{ heroId: string, heroName: string, description: string, color: string }
```

### `POST /api/dossier` — AI Mission Dossier (Core Route)

```typescript
// Request
{
  heroId: string,        // "iron_man"
  heroName: string,      // "Tony Stark"
  course: string,        // "B.Tech Computer Science"
  interests?: string[]   // From quiz context
}

// Logic
// 1. Validate with Zod schema
// 2. Sanitize inputs (strip prompt injection patterns)
// 3. Rate limit check: Redis sliding window (10 req/min per IP)
// 4. Generate cache key: MD5(heroId + course)
// 5. Check Redis → return cached dossier if hit (< 10ms)
// 6. Call Groq API with S.H.I.E.L.D. system prompt
// 7. Stream response back to client (typewriter effect)
// 8. Cache assembled dossier in Redis (TTL: 24h)

// Response (streamed)
ReadableStream → structured JSON dossier chunks
```

### `POST /api/save` — Archive to MongoDB

```typescript
// Request
{ sessionId: string, dossier: DossierData }

// Logic: Mongoose upsert on sessionId
// Response: { saved: true, id: string }
```

### `GET /api/salary`

```typescript
// Query: ?careerId=software-engineer
// Response: SalaryByCity[] — city, minLPA, maxLPA, medianLPA
```

### `GET /api/history`

```typescript
// Query: ?sessionId=abc123
// Response: Dossier[] — user's saved mission dossiers
```

### Rate Limiting (Redis Sliding Window)

```typescript
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}:${Math.floor(Date.now() / 60000)}`;
  const count = await redis.incr(key);
  await redis.expire(key, 60);
  return count <= 10; // 10 AI requests per minute per IP
}
```

---

## 8. DATABASE DESIGN

### Collection: `dossiers`

```json
{
  "_id": "ObjectId",
  "sessionId": "string",
  "heroId": "iron_man",
  "heroName": "Tony Stark",
  "course": "B.Tech Computer Science",
  "careerPaths": [
    {
      "title": "Software Engineer",
      "description": "...",
      "growthOutlook": "very_high",
      "salaryRange": { "entry": "6-12 LPA", "senior": "30-80 LPA" }
    }
  ],
  "skills": ["DSA", "System Design", "React", "AWS", "Python"],
  "certifications": ["AWS Solutions Architect", "Google Cloud ACE"],
  "salaryRange": "6–80 LPA (entry to senior)",
  "heroQuote": "In a world full of average careers, be Iron Man.",
  "roadmapSteps": [
    { "year": 1, "milestone": "Learn DSA + Web Basics", "avenger": "captain_america" },
    { "year": 2, "milestone": "Build Projects + Internship", "avenger": "iron_man" },
    { "year": 3, "milestone": "Open Source + Competitive Coding", "avenger": "thor" },
    { "year": 4, "milestone": "Placement Prep + First Job", "avenger": "hulk" }
  ],
  "higherStudies": ["M.Tech (IIT/NIT)", "MBA (IIM)", "MS abroad"],
  "shared": false,
  "createdAt": "ISODate"
}
```

### Collection: `sessions`

```json
{
  "_id": "ObjectId",
  "sessionId": "string (UUID, stored in localStorage)",
  "quizAnswers": ["array of 5 answer strings"],
  "assignedHeroId": "iron_man",
  "assignedHeroName": "Tony Stark",
  "ip": "string (hashed, for rate limiting only)",
  "createdAt": "ISODate"
}
```

### Collection: `courses`

```json
{
  "_id": "ObjectId",
  "name": "B.Tech Computer Science",
  "shortCode": "btechcs",
  "stream": "Engineering",
  "duration": 4,
  "level": "undergraduate",
  "careerIds": ["ObjectId refs"],
  "avgSalaryStart": 450000,
  "jobDemand": "very_high",
  "topColleges": ["IIT Bombay", "NIT Trichy", "BITS Pilani"],
  "entryExams": ["JEE Main", "JEE Advanced"],
  "tags": ["tech", "software", "data", "engineering"],
  "avenger": "iron_man"
}
```

### Collection: `careers`

```json
{
  "_id": "ObjectId",
  "title": "Software Engineer",
  "slug": "software-engineer",
  "courseIds": ["ObjectId refs"],
  "salaryByCity": {
    "mumbai":    { "min": 600000,  "max": 2500000, "median": 1200000 },
    "bangalore": { "min": 700000,  "max": 3000000, "median": 1400000 },
    "delhi":     { "min": 500000,  "max": 2000000, "median": 1000000 },
    "pune":      { "min": 500000,  "max": 1800000, "median": 900000 },
    "hyderabad": { "min": 550000,  "max": 2200000, "median": 1100000 },
    "tier2":     { "min": 300000,  "max": 800000,  "median": 500000 }
  },
  "growthOutlook": "very_high",
  "topSkills": ["JavaScript", "Python", "System Design", "DSA", "Cloud"],
  "certifications": ["AWS SAA", "Google Cloud ACE", "Meta Front-End"],
  "companiesHiring": ["Google", "Microsoft", "Amazon", "Infosys", "TCS"],
  "higherStudies": ["M.Tech", "MBA Tech", "MS abroad"],
  "quizTags": ["analytical", "building", "technology"],
  "avenger": "iron_man"
}
```

### Collection: `analytics`

```json
{
  "_id": "ObjectId",
  "heroId": "iron_man",
  "course": "B.Tech Computer Science",
  "region": "Maharashtra",
  "createdAt": "ISODate"
}
```
*Tracks aggregate trends — no PII stored.*

### MongoDB Indexes

```javascript
// Courses — full-text search
db.courses.createIndex({ name: "text", tags: "text" })
db.courses.createIndex({ stream: 1 })
db.courses.createIndex({ shortCode: 1 }, { unique: true })

// Careers — lookup by course and quiz personality
db.careers.createIndex({ slug: 1 }, { unique: true })
db.careers.createIndex({ courseIds: 1 })
db.careers.createIndex({ quizTags: 1 })

// Dossiers — session history lookup
db.dossiers.createIndex({ sessionId: 1 })
db.dossiers.createIndex({ createdAt: -1 })
```

---

## 9. AI INTEGRATION — GROQ API

### Model Selection

| Property | Value |
|---|---|
| Model | `llama-3.3-70b-versatile` |
| Avg Full Dossier Latency | **< 1.8 seconds** |
| Token Speed | **500+ tokens/second** (Groq LPU) |
| Output Mode | Structured JSON (enforced via system prompt) |
| Cost | **Free tier** — no billing setup needed in hackathon |

### Groq Client Setup

```typescript
// lib/groq.ts
import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!, // Server-side only — never exposed to client
});
```

### System Prompt — S.H.I.E.L.D. Intelligence AI

```typescript
export const SHIELD_SYSTEM_PROMPT = `
You are S.H.I.E.L.D.'s career intelligence AI — the most advanced career
advisory system on the planet, operating from the Helicarrier.

You have deep knowledge of:
- Indian education system (IITs, NITs, IIMs, state universities, private colleges)
- Indian job market, hiring companies, salary ranges (in LPA — Lakhs Per Annum)
- Career paths from undergraduate courses to senior positions
- Certifications, competitive exams, higher studies options

Your persona: Authoritative, precise, slightly dramatic (like a S.H.I.E.L.D. briefing).
Every response is a CLASSIFIED MISSION DOSSIER.

CRITICAL: Return ONLY valid JSON. No markdown. No backticks. No preamble.

JSON schema to return:
{
  "classification": "CLASSIFIED // S.H.I.E.L.D. EYES ONLY",
  "agentDesignation": "[hero name]",
  "missionBriefing": "2-sentence overview of the career landscape",
  "careerPaths": [
    {
      "title": "Career title",
      "description": "What they actually do day-to-day",
      "entryLPA": "X–Y LPA",
      "seniorLPA": "X–Y LPA",
      "demandLevel": "Critical / High / Moderate",
      "topCompanies": ["Company1", "Company2", "Company3"]
    }
  ],
  "criticalSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "certifications": ["cert1", "cert2", "cert3"],
  "roadmap": [
    { "phase": "Year 1", "objective": "...", "avenger": "captain_america" },
    { "phase": "Year 2", "objective": "...", "avenger": "iron_man" },
    { "phase": "Year 3", "objective": "...", "avenger": "thor" },
    { "phase": "Year 4 / Final", "objective": "...", "avenger": "hulk" }
  ],
  "higherStudies": ["Option 1", "Option 2", "Option 3"],
  "salaryIntel": {
    "mumbai": { "entry": "X LPA", "senior": "Y LPA" },
    "bangalore": { "entry": "X LPA", "senior": "Y LPA" },
    "delhi": { "entry": "X LPA", "senior": "Y LPA" },
    "tier2": { "entry": "X LPA", "senior": "Y LPA" }
  },
  "heroQuote": "One powerful, personalized motivational line connecting hero to career",
  "threatAssessment": "Honest note about competition or challenges in this field"
}

Rules:
- All salary figures in Indian LPA (Lakhs Per Annum) — be specific and realistic
- Reference actual Indian companies, exams, and institutions
- Keep heroQuote sharp, specific, and Marvel-flavored
- Be honest in threatAssessment — it builds trust
`;
```

### User Prompt Template

```typescript
export function buildDossierPrompt(
  heroName: string,
  course: string,
  interests?: string[]
): string {
  return `
MISSION BRIEFING REQUEST

Agent Identity: ${heroName}
Academic Field: ${course}
Personal Interests: ${interests?.join(", ") || "Classified"}
Context: Indian student, planning career path

Generate complete Mission Dossier. Indian market context required.
`.trim();
}
```

### AI Response Caching

```typescript
// Cache key = MD5(heroId + course)
// Redis TTL = 86400 seconds (24 hours)
// Expected cache hit rate: ~75% for popular course/hero combos

import crypto from "crypto";

export async function getCachedDossier(heroId: string, course: string) {
  const key = `dossier:${crypto
    .createHash("md5")
    .update(heroId + course.toLowerCase().trim())
    .digest("hex")}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheDossier(
  heroId: string,
  course: string,
  dossier: object
) {
  const key = `dossier:${crypto
    .createHash("md5")
    .update(heroId + course.toLowerCase().trim())
    .digest("hex")}`;
  await redis.setex(key, 86400, JSON.stringify(dossier));
}
```

### Error Handling

```typescript
// Always wrap Groq parse in try/catch
// Fallback: render plain text dossier if JSON parse fails
try {
  const dossier = JSON.parse(groqResponse);
  return NextResponse.json(dossier);
} catch {
  // Graceful degradation — display raw text in dossier panel
  return NextResponse.json({ raw: groqResponse, parseError: true });
}
```

---

## 10. DATA FLOW — REQUEST LIFECYCLE

### Flow 1: Avengers Aptitude Assessment → Hero Assignment

```
Student lands on /quiz
    │
    ▼
QuizEngine renders Question 1 of 5 (Framer Motion slide-in)
    │
    ▼ (Student answers all 5 questions — pure client state)
    │
    ▼
POST /api/assess  { answers: [...] }
    │
    ▼
Scoring matrix: weight each answer → sum scores per hero archetype
    │
    ▼
Top-scoring hero returned:  { heroId: "iron_man", heroName: "Tony Stark" }
    │
    ▼
Navigate to /hero/iron_man
    │
    ▼ ⭐ HERO REVEAL SEQUENCE (4 seconds, Framer Motion)
    │   Screen → black → S.H.I.E.L.D. logo pulses → "AGENT IDENTIFIED"
    │   → Hero silhouette rises → CLASSIFIED stamp → typewriter text
    │
    ▼
"BEGIN MISSION" CTA → navigate to /dossier with heroId in state
```

### Flow 2: Mission Dossier Generation (Core AI Flow)

```
Student on /dossier page — types course name
    │
    ▼ (300ms debounce)
GET /api/courses?search=btech → MongoDB text search → dropdown
    │
    ▼ Student selects course → clicks "Generate Mission Dossier"
    │
    ▼
POST /api/dossier  { heroId, heroName, course, interests }
    │
    ▼
Zod validation → sanitize inputs (strip injection patterns)
    │
    ▼
Rate limit check: Redis INCR "ratelimit:{IP}:{minute}"
    │           │
   OK (≤10)   EXCEEDED → 429 + "S.H.I.E.L.D. rate limit active, Agent."
    │
    ▼
Cache key = MD5(heroId + course)
    │
    ▼
Redis GET cache_key
    │                   │
  CACHE HIT           CACHE MISS
  (< 10ms)                │
    │                     ▼
    │               Groq API call
    │               (streaming enabled)
    │                     │
    │                     ▼
    │               Stream chunks → client
    │               Typewriter effect renders
    │               in DossierPanel in real-time
    │                     │
    │                     ▼
    │               Assemble full JSON
    │                     │
    │                     ▼
    │               Redis SETEX (TTL: 24h)
    │                     │
    └─────────────────────┘
                          │
                          ▼
                 DossierPanel renders:
                 Classification header + CLASSIFIED stamp
                 Career Paths section
                 Skills & Certifications
                 Salary Intel (city-wise)
                 Hero's Journey Roadmap
                 Hero Quote footer
```

### Flow 3: Save & Share Dossier

```
Student clicks "File to S.H.I.E.L.D. Archive"
    │
    ▼
POST /api/save  { sessionId (from localStorage), dossier }
    │
    ▼
Mongoose upsert → MongoDB dossiers collection
    │
    ▼
/history page → GET /api/history?sessionId=xxx → render saved dossiers

─────────────────────────────────────────────────────────

Student clicks "Transmit Mission Card"
    │
    ▼
html2canvas captures #mission-card div
    │
    ▼
Canvas → PNG blob → auto-download
"mission-briefing-tony-stark.png"
```

---

## 11. KEY FEATURES — TECHNICAL BREAKDOWN

| Feature | Implementation | Judging Impact |
|---|---|---|
| **Avengers Aptitude Quiz** | 5 questions, client state, weighted scoring matrix in `/api/assess` | Emotional hook — judges play it themselves |
| **⭐ Hero Reveal Sequence** | Framer Motion staggered animation, 4-second cinematic sequence | Peak WOW moment — judges lean forward |
| **AI Mission Dossier** | Groq API + structured JSON prompt → `DossierPanel` with typewriter | Core value proposition |
| **Visual Roadmap** | SVG + Framer Motion stagger, Avenger-icon nodes, clickable tooltips | Differentiator from generic bullet lists |
| **Salary Heatmap** | Recharts bar chart, Indian city-wise data from MongoDB | Extremely relevant for Indian students + judges |
| **Save to Archive** | POST `/api/save` → Mongoose upsert → `/history` page | Demonstrates full-stack depth |
| **Mission Card Share** | `html2canvas` on dossier div → PNG download | Viral / social proof moment |
| **Responsive Layout** | Tailwind breakpoints, mobile-first card grid | Guaranteed 15/15 responsiveness points |

---

## 12. SCALABILITY CONSIDERATIONS

### Current Capacity (Free Tier Stack)

| Resource | Free Limit | Expected Hackathon Usage |
|---|---|---|
| Vercel Serverless | 100 GB-hr / month | ~2 GB during demo |
| MongoDB Atlas M0 | 512 MB storage | ~5 MB for seed data |
| Groq Free Tier | ~1,000 req/day | ~200 during demo |
| Upstash Redis | 10,000 cmd/day | ~500 during demo |

### Post-Hackathon Scaling Path

```
10 users/day    → Free tier (current architecture)
      ↓
1,000 users/day → MongoDB M2 ($9/mo), Upstash Pay-as-go
      ↓
10,000 users/day → MongoDB M10 ($57/mo), Vercel Pro, Redis cluster,
                   ISR for popular dossiers (revalidate: 3600)
      ↓
100,000 users/day → MongoDB Atlas dedicated, read replicas,
                    Background job queue (BullMQ), Groq → dedicated tier
```

### Architecture Scalability Strengths

- **Stateless API routes** — HEROtal scaling on Vercel is automatic
- **Redis cache** — 75%+ cache hit rate means Groq calls grow slowly vs user growth
- **AI abstraction** — swap Groq for OpenAI/Anthropic with one environment variable
- **MongoDB Atlas** — auto-scales with Atlas serverless tier
- **ISR pages** — career detail pages can be statically cached for popular courses

### Product Roadmap (Future Versions)

- **v2:** NextAuth.js user accounts → personal career portfolios
- **v2:** Resume builder pre-filled from Mission Dossier data
- **v3:** Real college/university admission data API integration
- **v3:** Mentor matching — students connect with professionals sharing their hero archetype
- **v4:** Multi-language support (Hindi, Tamil, Bengali) for Tier-2/3 India penetration
- **Startup Pitch:** TAM = 40M college students in India. Monetization: freemium (3 free dossiers, ₹99/month unlimited) + B2B (colleges license for career counseling)

---

## 13. SECURITY & PRIVACY

### Privacy-First Design

- **No PII stored** — quiz answers are ephemeral (computed → discarded after hero assignment)
- **No real user auth** — sessionId is a random UUID stored in localStorage
- **Analytics collection** stores only: heroId, course, region — zero personal identifiers
- **No tracking cookies** — Vercel Analytics is privacy-compliant, aggregate only
- **HTTPS only** — Vercel enforces TLS 1.3 by default

### API Key Protection

```typescript
// NEVER expose in client-side code
// All AI calls are server-side only
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// process.env.GROQ_API_KEY is undefined on client — Next.js enforces this
// MONGODB_URI, UPSTASH tokens — same pattern, server-only
```

### Input Sanitization & Prompt Injection Prevention

```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, "")
    .replace(/system prompt/gi, "")
    .replace(/\[INST\]/gi, "")
    .replace(/<<SYS>>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags
    .trim()
    .slice(0, 500); // hard length limit
}
```

### Request Validation (Zod)

```typescript
import { z } from "zod";

const dossierRequestSchema = z.object({
  heroId: z.string().min(2).max(50),
  heroName: z.string().min(2).max(100),
  course: z.string().min(2).max(200),
  interests: z.array(z.string().max(50)).max(10).optional(),
});
```

### MongoDB Security

```typescript
// Connection string in environment variable only — never hardcoded
// MongoDB Atlas: IP whitelist includes Vercel's IP ranges
// Connection pooling with singleton to prevent connection leaks
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
```

### CORS Configuration

```typescript
// next.config.js — restrict in production
const nextConfig = {
  async headers() {
    return [{
      source: "/api/:path*",
      headers: [{ key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL }]
    }];
  }
};
```

---

## 14. PERFORMANCE OPTIMIZATIONS

### Target Scores

| Metric | Target | Strategy |
|---|---|---|
| Lighthouse Performance | > 90 | SSR, image optimization, code splitting |
| First Contentful Paint | < 1.2s | SSR pre-renders course list on initial load |
| Largest Contentful Paint | < 2.5s | Critical CSS inlined, fonts preloaded |
| AI Dossier Response | < 1.8s | Groq LPU + Redis cache (< 10ms on cache hit) |
| MongoDB Query Time | < 50ms | Text indexes + connection pooling singleton |

### Implementation Techniques

**SSR for Initial Course Results (No Loading Spinner)**
```typescript
// app/dossier/page.tsx
export default async function DossierPage() {
  const popularCourses = await getPopularCourses(); // Pre-fetched on server
  return <DossierClient initialCourses={popularCourses} />;
}
```

**Dynamic Imports for Heavy Libraries**
```typescript
// Code-split Framer Motion and charts — load only when needed
const HeroReveal = dynamic(
  () => import("@/components/shield/HeroReveal"),
  { ssr: false, loading: () => <ShieldLoader /> }
);
const SalaryHeatmap = dynamic(() => import("@/components/career/SalaryHeatmap"));
```

**MongoDB Connection Singleton**
```typescript
// Prevents connection storm on serverless cold starts
export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

**Image Optimization**
```tsx
import Image from "next/image";
// Automatic WebP conversion, lazy loading, srcset generation
<Image src="/shield/ironman-silhouette.png" width={300} height={400}
       alt="Tony Stark" priority={false} />
```

---

## 15. RISK ASSESSMENT & MITIGATIONS

| Risk | Probability | Mitigation |
|---|---|---|
| Groq API rate limit hit | Low | Cache last response in Redis; show cached dossier if limit hit |
| MongoDB Atlas cold start | Medium | Pre-warm connection at app startup via `connectDB()` in layout.tsx |
| Hero reveal animation bugs | Medium | Build plain fallback (no animation) first; add Framer Motion last |
| Demo WiFi failure | **High** | **Pre-generate 3 complete dossiers; store in MongoDB; show live + cached** |
| Time overrun on WOW feature | Medium | Timebox hero reveal to 45 min; cut share card feature if needed |
| Groq JSON hallucination | Low | Wrap `JSON.parse` in try/catch; fallback to plain text dossier render |
| MongoDB seed not loaded | Low | Run seed script immediately after connection; verify in Atlas UI |
| Vercel deploy fails | Low | Keep localhost running in parallel; have backup deployment on Netlify |

### Demo Failure Safeguards

```
1. Pre-save 3 complete dossiers to MongoDB before presenting:
   - Iron Man + B.Tech Computer Science
   - Black Widow + BBA / Management
   - Doctor Strange + MBBS

2. If Groq fails live:
   Show pre-cached result. Say: "Here's one we generated earlier —
   this is what the system produces in under 2 seconds."

3. Have both Vercel deploy URL + localhost running simultaneously.

4. Keep browser DevTools closed during demo (hides any console errors).
```

---

## 16. JUDGING CRITERIA ALIGNMENT

| Criterion | Max | Target | Winning Edge |
|---|---|---|---|
| **Design & UI/UX** | 30 | **28–29** | Cinematic Marvel dark UI with gold/red palette, glass-morphism cards, `CLASSIFIED` dossier panels, arc reactor animations — looks like a funded startup, not a hackathon project |
| **Functionality** | 25 | **23** | 6 real integrated features: personality quiz → hero reveal → AI dossier → roadmap visualizer → salary heatmap → save/share — all working end-to-end |
| **Responsiveness** | 15 | **14** | Tailwind mobile-first + Next.js SSR = verified on 320px to 1440px, tested in Chrome DevTools |
| **Code Quality** | 15 | **13** | TypeScript throughout, Zod validation, Mongoose schemas, environment variables, singleton patterns, no TODOs in demo code |
| **Creativity** | 10 | **9–10** | Hero-personality quiz mapping careers to Avengers, cinematic reveal sequence, Mission Dossier format — genuinely novel concept no other team replicates |
| **Theme Adherence** | 5 | **5** | S.H.I.E.L.D. acronym, every piece of copy, color, animation, and feature is Marvel-themed — strict and consistent |
| **TOTAL** | **100** | **92–94** | |

---

## 17. DEMO & STORYTELLING STRATEGY

### 60-Second Pitch Script

> *"Every year, 10 million students in India pick a course — and have no idea what comes next.*
>
> *They Google. They panic. They settle.*
>
> **We built S.H.I.E.L.D. — Superhero HERO Intelligence for Education & Life Decisions.**
>
> *You take a 60-second personality quiz. We assign you a Marvel hero. Then our AI — powered by Groq — generates a classified Mission Dossier: your career paths, skills to build, certifications to earn, and exactly what you'll earn in Mumbai vs Lucknow. In under 2 seconds.*
>
> **Not a chatbot. Not a website. A mission briefing.**
>
> *Every hero needs a mission. We give you yours."*

### Demo Flow (5 Minutes)

**[0:00] — First Impression**
Open the browser. Dark cinematic landing. Particle field. Glowing gold headline: *"Assemble Your Future, Hero."*
Say nothing for 3 seconds. Let the UI speak. Then: *"This is S.H.I.E.L.D."*

**[0:30] — The Quiz**
Click "Begin Your Mission." Answer 2–3 questions live (keep it punchy).
Say: *"5 questions. 60 seconds. We're about to find out what kind of hero you are."*

**[1:00] — ⭐ The Hero Reveal**
Screen goes dark. S.H.I.E.L.D. logo pulses. "AGENT IDENTIFIED."
Hero silhouette rises. CLASSIFIED stamp. Typewriter: *"You are Tony Stark. Your mission begins now."*
**Let the judges react.** Don't rush past this moment. This is your peak.

**[2:00] — The Mission Dossier**
Type `"B.Tech Computer Science"` → select from autocomplete.
Click `"Generate Mission Dossier"`.
Groq returns in < 2 seconds. Typewriter effect. Classified document renders.
Point out: Career Paths, Salary Intel (city-wise), Hero's Journey Roadmap, Hero Quote.

**[3:30] — The Salary Heatmap**
Click `"Infinity Earnings Scale"`. Gold bar chart renders.
*"₹7L entry in Tier-2 India vs ₹30L senior in Bangalore. Students deserve to know this before they choose."*

**[4:00] — Save & Share**
Click `"File to S.H.I.E.L.D. Archive"` → History page shows saved dossier.
Click `"Transmit Mission Card"` → PNG card downloads.
*"Every student can carry their mission briefing."*

**[4:30] — The Close**
Show GitHub (clean README, live deployment link visible in README).
Show Vercel dashboard: *"Live. Scalable. Zero downtime."*

Final line:
> *"We didn't just build a website. We gave 40 million Indian students a mission briefing."*

### Storytelling Principles

- **Lead with impact, not technology.** Judges remember the emotion of the hero reveal, not the tech stack.
- **Show, don't tell.** Every feature claim is demonstrated live — no slides, no screenshots.
- **One personal line.** *"We asked ourselves what would have helped us when we were choosing our stream."* Judges are humans first.
- **Drop 3 precise metrics** naturally: *"under 2 seconds," "zero PII stored," "90+ Lighthouse score."* Shows depth without boring.
- **The hero reveal is your peak.** Don't rush past it. Silence for 2 seconds after it plays. Let it land.

---

## 18. TEAM EXECUTION ROADMAP

### Recommended Team Split (3 Hours)

| Member | Role | Primary Tasks |
|---|---|---|
| **Member 1** | Frontend Lead | Landing page, Navbar, S.H.I.E.L.D. theme CSS, HeroSection, particle effect |
| **Member 2** | Full-Stack | Groq API route, MongoDB connection, seed data, `/api/dossier`, Redis cache |
| **Member 3** | UI Components | HeroReveal animation, DossierPanel, RoadmapVisualizer, SalaryHeatmap |
| **Member 4** | Quiz + Polish | QuizEngine, `/api/assess` scoring matrix, MissionCard share, README, demo prep |

### Phase Checkpoints

**[0:00–0:30] Foundation — Get Live URL First**
- [ ] `npx create-next-app@latest shield-career --typescript --tailwind --app`
- [ ] Push to GitHub → connect Vercel → first deploy (get live URL NOW)
- [ ] MongoDB Atlas: create cluster, database, get connection string
- [ ] All environment variables set in Vercel dashboard
- [ ] Groq API key obtained and tested with a `curl` call
- [ ] Upstash Redis: create database, get REST URL + token

**[0:30–1:15] Core Structure**
- [ ] Landing page with S.H.I.E.L.D. dark theme, particle field CSS, gold headline
- [ ] MongoDB seed script running — 20 courses, 15 careers seeded
- [ ] `/api/courses` search route working (test in browser)
- [ ] S.H.I.E.L.D. color tokens in `globals.css` and `tailwind.config.ts`
- [ ] Quiz component renders 5 questions (client state, no backend yet)

**[1:15–2:00] Core Features**
- [ ] `/api/assess` — scoring matrix returns hero assignment
- [ ] Hero Reveal sequence (HeroReveal.tsx) — even basic version working
- [ ] `/api/dossier` — Groq call with system prompt returns JSON dossier
- [ ] DossierPanel renders structured dossier response
- [ ] SalaryHeatmap renders with Recharts and MongoDB salary data

**[2:00–2:45] Polish + Power Features**
- [ ] Framer Motion animations on hero reveal (the WOW sequence)
- [ ] RoadmapVisualizer with staggered Avenger-icon nodes
- [ ] `/api/save` + `/history` page working
- [ ] MissionCard PNG export (html2canvas)
- [ ] Mobile responsiveness verified in Chrome DevTools

**[2:45–3:00] Demo Prep**
- [ ] Final deploy pushed, live URL verified working end-to-end
- [ ] Pre-save 3 complete dossiers to MongoDB (failsafe for demo)
- [ ] GitHub README with live link + screenshot
- [ ] Team rehearses demo flow once (who speaks when)
- [ ] Browser DevTools closed, clean window ready

---

## 19. OPTIONAL ENHANCEMENTS

*Build in priority order if time allows:*

| Priority | Feature | Time Est. | Impact |
|---|---|---|---|
| 1 | **WhatsApp share button** on Mission Card | 15 min | Huge in India — judges notice |
| 2 | **Dark/light mode toggle** (3 lines Tailwind dark:) | 10 min | Accessibility + polish |
| 3 | **"Trending Missions" ticker** — most generated hero+course combos | 20 min | Dynamic feel, uses analytics collection |
| 4 | **College recommendations** per career (uses colleges seed data) | 25 min | Adds practical depth |
| 5 | **Bookmark career** to localStorage | 15 min | Persistence without auth overhead |
| 6 | **Animated counter** on landing: "X agents briefed today" | 10 min | Social proof, uses analytics aggregate |

---

## 20. APPENDIX

### Environment Variables

```bash
# .env.local — NEVER commit to GitHub

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shield-career

# AI Engine
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cache
UPSTASH_REDIS_REST_URL=https://xxxxxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=random-32-char-string-here
```

### Hero Scoring Matrix

```typescript
// lib/heroAssignment.ts
// Maps quiz answer combinations to hero identity
export const HERO_SCORING_MATRIX = {
  iron_man: {
    name: "Tony Stark", traits: ["analytical", "innovative", "ambitious"],
    color: "#F5A623", careers: ["Software Engineer", "Entrepreneur", "Data Scientist"]
  },
  black_panther: {
    name: "T'Challa", traits: ["leadership", "strategic", "responsible"],
    color: "#7C3AED", careers: ["Business Analyst", "Product Manager", "Policy Maker"]
  },
  captain_america: {
    name: "Steve Rogers", traits: ["resilient", "team-oriented", "principled"],
    color: "#2563EB", careers: ["Military", "Civil Services", "Social Work", "Teaching"]
  },
  doctor_strange: {
    name: "Doctor Strange", traits: ["curious", "precise", "knowledge-seeking"],
    color: "#10B981", careers: ["Doctor", "Researcher", "Professor", "Scientist"]
  },
  thor: {
    name: "Thor", traits: ["powerful", "bold", "natural leader"],
    color: "#F59E0B", careers: ["Lawyer", "Politician", "Sports Professional", "CEO"]
  },
  black_widow: {
    name: "Natasha Romanoff", traits: ["adaptable", "perceptive", "strategic"],
    color: "#C0392B", careers: ["Intelligence Analyst", "UX Researcher", "Journalist", "Psychologist"]
  },
  bruce_banner: {
    name: "Bruce Banner", traits: ["intellectual", "problem-solver", "introverted"],
    color: "#10B981", careers: ["Research Scientist", "Engineer", "Data Analyst", "Academic"]
  },
};
```

### Seed Data Template

```typescript
// data/seed.ts — run once to populate MongoDB
const courses = [
  { name: "B.Tech Computer Science", shortCode: "btechcs", stream: "Engineering",
    duration: 4, avenger: "iron_man", entryExams: ["JEE Main", "JEE Advanced"] },
  { name: "MBBS", shortCode: "mbbs", stream: "Medical",
    duration: 5.5, avenger: "doctor_strange", entryExams: ["NEET"] },
  { name: "B.Com", shortCode: "bcom", stream: "Commerce",
    duration: 3, avenger: "black_widow", entryExams: ["Class 12 Merit"] },
  { name: "BBA", shortCode: "bba", stream: "Management",
    duration: 3, avenger: "black_panther", entryExams: ["IPMAT", "SET"] },
  { name: "B.Sc Data Science", shortCode: "bscds", stream: "Science",
    duration: 3, avenger: "thor", entryExams: ["Class 12 Merit"] },
  { name: "LLB", shortCode: "llb", stream: "Law",
    duration: 3, avenger: "captain_america", entryExams: ["CLAT", "AILET"] },
  { name: "B.Arch", shortCode: "barch", stream: "Design",
    duration: 5, avenger: "bruce_banner", entryExams: ["NATA", "JEE Paper 2"] },
  { name: "B.Tech Mechanical", shortCode: "btechmech", stream: "Engineering",
    duration: 4, avenger: "thor", entryExams: ["JEE Main"] },
  { name: "BA Psychology", shortCode: "bapsych", stream: "Arts",
    duration: 3, avenger: "black_widow", entryExams: ["Class 12 Merit"] },
  { name: "B.Pharm", shortCode: "bpharm", stream: "Pharmacy",
    duration: 4, avenger: "doctor_strange", entryExams: ["NEET", "GPAT"] },
  { name: "CA (Chartered Accountancy)", shortCode: "ca", stream: "Commerce",
    duration: 5, avenger: "black_panther", entryExams: ["CA Foundation"] },
  { name: "B.Tech Electronics", shortCode: "btechece", stream: "Engineering",
    duration: 4, avenger: "iron_man", entryExams: ["JEE Main"] },
  { name: "BSW (Social Work)", shortCode: "bsw", stream: "Arts",
    duration: 3, avenger: "captain_america", entryExams: ["Class 12 Merit"] },
  { name: "BCA", shortCode: "bca", stream: "Technology",
    duration: 3, avenger: "iron_man", entryExams: ["Class 12 Merit"] },
  { name: "B.Sc Nursing", shortCode: "bscnursing", stream: "Medical",
    duration: 4, avenger: "captain_america", entryExams: ["NEET"] },
];
```

---

*Document Classification: S.H.I.E.L.D. LEVEL 7 — WEBATHON CLEARANCE*

*Prepared for: Webathon · Tech Astra 2026*

*S.H.I.E.L.D. — Superhero HERO Intelligence for Education & Life Decisions*

> *"Part of the journey is the end. But with the right mission briefing, your journey starts stronger."*

---

**© 2026 S.H.I.E.L.D. Career Initiative Team | Built with purpose at Tech Astra Webathon**

`CLASSIFIED // S.H.I.E.L.D. INTERNAL DOCUMENT // EYES ONLY`
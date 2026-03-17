# S.H.I.E.L.D. — Superhero Career Intelligence

**S.H.I.E.L.D.** (Superhero Horizon Intelligence for Education & Life Decisions) is an immersive, Marvel-themed AI career guidance platform. It maps user personalities to Avenger archetypes and generates highly personalized, classified "Mission Dossiers" outlining their ideal career paths, necessary skills, and salary intelligence.

Powered by Next.js and the rapid Groq LLaMA-3.3-70B model, S.H.I.E.L.D. turns the stressful process of career planning into an engaging, cinematic, and data-driven experience.

## ✨ Features

- **🦸‍♂️ Avengers Aptitude Assessment**: A 5-question personality quiz that determines your Marvel hero archetype (Iron Man, Black Panther, Thor, etc.).
- **🎬 Cinematic Hero Reveal**: A fully animated, suspenseful reveal sequence that assigns your core competency.
- **🤖 AI Mission Dossier**: Powered by Groq AI, generates a comprehensive career roadmap, critical skills, certifications, and higher studies options in under 2 seconds.
- **💰 Infinity Earnings Scale**: City-wise salary intelligence across major Indian tech hubs (Bangalore, Mumbai, Delhi, etc.) for both entry-level and senior roles.
- **📊 Course Comparator**: Side-by-side analysis of popular educational paths (e.g., B.Tech CS vs. BBA vs. MBBS) highlighting pros, cons, and ROI.
- **🔒 Secure Agent Authentication**: JWT-based login and signup system backed by MongoDB to archive past mission dossiers.
- **📱 Mobile-First Design**: A sleek, responsive user interface featuring a native-feeling bottom navigation bar and dynamic grid layouts.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, Lucide React (Icons)
- **Backend**: Next.js API Routes, Node.js
- **Database / Auth**: MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs
- **AI Engine**: Groq API (LLaMA-3.3-70B-Versatile)
- **Styling**: Vanilla CSS with comprehensive CSS variables, flexbox/grid layouts, and responsive media queries

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd techxastra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # MongoDB Connection String
   MONGODB_URI="your_mongodb_connection_string"
   
   # JWT Secret for Authentication
   JWT_SECRET="your_highly_secure_random_string"
   
   # Groq API Key for AI Generation
   GROQ_API_KEY="your_groq_api_key_here"
   
   # App URL (Optional, for production)
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/app`: Next.js App Router pages (`/quiz`, `/salary`, `/compare`, `/dossier`, `/hero/[id]`, etc.)
- `/app/api`: Backend API routes for authentication (`/api/auth/login`, `/api/auth/signup`)
- `/components`: Reusable client and server components (e.g., `ClientNavbar.js`)
- `/lib`: Helper functions for authentication (`auth.js`), database connection (`mongodb.js`), and Groq integration (`groq.js`)
- `/models`: MongoDB Mongoose schemas (e.g., `User.js`)

## 💡 How It Works (The Mission Protocol)

1. **Take the Quiz**: Users answer situational questions without needing to log in.
2. **Hero Reveal**: The system calculates the best-fit archetype (`heroAssignment.js`) and plays a transition animation.
3. **Generate Dossier**: The user inputs a target career or course. The app calls the Groq AI API with a carefully crafted prompt to generate a JSON response containing a structured career path.
4. **Review & Compare**: Users can explore salary brackets or compare alternative courses using the built-in intelligence tools.
5. **Enlist (Signup)**: Users can create an account to save their dossiers to the archive.

## 🎯 Contributing

Contributions, issues, and feature requests are welcome! 

## 📜 License

This project is licensed under the MIT License.

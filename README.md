<div align="center">
  <img src="public/logo.png" width="160" height="160" alt="DevRoast AI Logo">
  <h1>DevRoast AI</h1>
  <p><strong>Brutally Honest • AI-Powered • Developer Analysis Ecosystem</strong></p>

  [![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://dev-roast-ai-sand.vercel.app)
  [![Next.js 16](https://img.shields.io/badge/Next.js-16-blue?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

---

## 🌪️ Overview
**DevRoast AI** is not just another GitHub analyzer—it's a high-tech "Interrogation Terminal" for your code. It combines advanced AI reasoning (Groq & SambaNova) with deep repository analytics to give you the most savage, insightful, and actionable feedback you've ever received. 

Whether you're looking to laugh at your "coding sins" or seriously prep for a FAANG interview, DevRoast AI is your ultimate developer companion.

---

## 🚀 Key Feature Pillar

### 🛠️ MVP Feature Set
*   **Deep GitHub Analysis**: Full-scale interrogation of your profile, contributions, and repositories.
*   **Repository Interrogation**: Paste any GitHub URL for a brutal architectural critique.
*   **AI Portfolio Generator**: Create stunning, personalized portfolios based on your Git history.
*   **Resume Enhancer**: Transform your boring list of tasks into high-impact, AI-optimized achievements.
*   **Code Review Bot**: Instant PR-style feedback on your latest commits.

### 🧠 AI Developer Suite
*   **AI Mentor Chat**: A contextual assistant that knows your code history and helps you refactor.
*   **Automated README Generator**: Generate world-class documentation for your projects automatically.
*   **Commit Auditor**: Analyzes your commit messages for clarity, impact, and "laziness".
*   **Diff Explainer**: Simplifies complex code changes into plain, understandable English.
*   **Stack Recommender**: Suggests the best modern stack (Next.js, Tailwind, etc.) for your specific project goals.

### 🏆 Core Engagement & Gamification
*   **Dev Duels**: Compete against other developers' profiles in a high-stakes AI-judged battle.
*   **Achievements (Badges)**: Earn unique badges like "The Midnight Submitter" or "Dependency Hoarder."
*   **Global Leaderboard**: See where you rank among the elite (or the unoptimized) developers globally.
*   **Neural Library**: A high-tech repository of all your past roasts and generated assets.

### 📊 Advanced Analysis
*   **Org Dashboard**: Analyze entire GitHub organizations for health and contribution patterns.
*   **Developer Score (Star Rating)**: A comprehensive 1-100 score based on code quality, consistency, and impact.
*   **Language Map**: Visual representation of your technological footprint.

---

## 🎨 Branding & Aesthetics
DevRoast AI features a **"Cyber-Industrial"** aesthetic with aggressive glassmorphism and thermal-inspired gradients.

### The Cyber Octocat Logo
Our primary brand mark features a 3D glassmorphism silhouette of the GitHub Octocat, enveloped in a radiant thermal AI aura. 

**Branding Suite Includes:**
- **Molten Git-Coin**: Symbolic of forging high-quality code.
- **Code Phoenix**: Represents the growth that comes from roasting old code.
- **Thermal Git-Web**: Visualizes the heat of complex repository networks.

---

## 💻 Technical Excellence

### The Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack.
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).
- **Authentication**: [Auth.js v5](https://authjs.dev/) (GitHub & Google OAuth).
- **Database**: [PostgreSQL (Neon.tech)](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/).
- **AI Engines**: Hybrid Multi-Key Rotation (**Groq** as primary, **SambaNova** as fallback).
- **Asset Management**: [Cloudinary](https://cloudinary.com/) for signature-authenticated uploads.
- **PWA**: Fully functional Progressive Web App with service workers and manifest support.

### AI Fallback Logic
We've implemented a robust "Exhaustion Strategy":
1.  **Groq Tier**: Rotates through 5+ API keys to maximize rate limits.
2.  **SambaNova Tier**: If Groq is exhausted, the system automatically falls back to a multi-key SambaNova pool.

---

## 🛠️ Local Installation

1.  **Clone & Install**
    ```bash
    git clone https://github.com/Ashwinjauhary/DevRoast-Ai.git
    cd devroast-ai
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file with the following essentials:
    ```env
    # Auth
    AUTH_SECRET="..."
    AUTH_GITHUB_ID="..."
    AUTH_GITHUB_SECRET="..."
    NEXTAUTH_URL="http://localhost:3000"

    # Database (Neon.tech Recommended)
    DATABASE_URL="postgresql://..."

    # AI
    GROQ_API_KEYS="key1,key2,..."
    SAMBANOVA_API_KEYS="key1,key2,..."

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
    CLOUDINARY_API_KEY="..."
    CLOUDINARY_API_SECRET="..."
    ```

3.  **Database Sync**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Launch**
    ```bash
    npm run dev
    ```

---

## 🚀 Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import the repository into Vercel.
3.  Add all the `.env` variables in the Vercel dashboard.
4.  *Crucial*: Set `AUTH_URL` and `NEXTAUTH_URL` to your Vercel production deployment URL.
5.  Deploy—The build script `prisma generate && next build` ensures your database client is always in sync.

---

<div align="center">
  <p>Built with 🔥 by <a href="https://github.com/Ashwinjauhary">Ashwin Jauhary</a></p>
  <p><em>"Your code is a museum of deprecated dependencies." - DevRoast AI</em></p>
</div>

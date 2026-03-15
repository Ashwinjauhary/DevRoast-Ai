<div align="center">
  <img src="public/logo.png" width="160" height="160" alt="DevRoast AI Logo">
  <h1>DevRoast AI</h1>
  <p><strong>The Ultimate "Interrogation Terminal" for Your Code History</strong></p>

  [![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://dev-roast-ai-sand.vercel.app)
  [![Next.js 16](https://img.shields.io/badge/Next.js-16-blue?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Ready-hotpink?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
</div>

---

## 🌪️ Overview
**DevRoast AI** is a premium, high-stakes developer analysis ecosystem. It doesn't just "analyze"—it **interrogates**. By leveraging state-of-the-art LLMs (Llama 3 70B via Groq & SambaNova) and deep repository analytics, DevRoast AI provides a brutally honest, 360-degree view of your technical identity.

> *"Your code is a museum of deprecated dependencies. We're just here to give you the tour."*

---

## 🏗️ System Architecture

```mermaid
graph TD
    User((Developer)) -->|Auth/Login| Auth[Auth.js v5]
    Auth -->|OAuth| GitHub[(GitHub API)]
    Auth -->|OAuth| Google[(Google API)]
    
    User -->|Interaction| FE[Next.js 16 UI]
    FE -->|Data Fetch| API[API Routes]
    
    API -->|Profile Data| GH[GitHub Integration Service]
    GH -->|Metadata| AI_Engine[AI Logic Manager]
    
    AI_Engine -->|Primary| Groq[Groq Llama-3 70B]
    AI_Engine -->|Fallback| SambaNova[SambaNova Multi-Key Pool]
    
    API -->|Storage| DB[(PostgreSQL / Neon)]
    DB <-->|ORM| Prisma[Prisma ORM]
    
    API -->|Asset Generation| Img[html2canvas / Portfolio Gen]
    Img -->|Upload| CD[Cloudinary CDN]
```

---

## 🚀 The Feature Universe

### 🛠️ Strategic Analysis
*   **Deep GitHub Intelligence**: Analyzes commit frequency, language diversity, and contribution impact.
*   **Architectural Interrogation**: Deep-dives into specific repositories to find technical debt and design flaws.
*   **Org Health Dashboard**: High-level metrics for entire GitHub organizations.
*   **Developer Star Rating**: A dynamic 1-100 score that evolves with your coding consistency.

### 🧠 The AI Developer Suite
*   **Neural AI Mentor**: A chat interface that remembers your specific project roasts to offer targeted refactoring advice.
*   **Automated Documentation**: High-quality `README.md` generation that doesn't look like a template.
*   **Commit Auditor**: Scores your commit history for clarity and professional impact.
*   **Diff Explainer**: Breakthrough logic to explain cryptic code changes to non-technical stakeholders.

### 💼 Career & Growth
*   **AI Portfolio Generator**: Generates high-conversion developer portfolios automatically.
*   **Resume Enhancer**: Analyzes your projects to generate "High-Impact" bullet points for your CV.
*   **Job Match Engine**: Recommends the best-fit roles based on your actual tech stack.
*   **Interview Prep**: Generates custom interview questions based on the repos you've built.

### 🎮 Gamification & Social
*   **Dev Duels**: Pit your GitHub 1v1 against friends or competitors in an AI-judged arena.
*   **Neural Library**: A permanent vault for all your roasts, portfolios, and badges.
*   **Leaderboards**: Compete for the title of the most optimized (or roasted) developer.

---

## 🎨 Design System & Branding
DevRoast AI uses a signature **"Cyber-Brutalism"** aesthetic. It's dark, fast, and high-contrast, built on a foundation of **Glassmorphism** and **Thermal Color Theory**.

### The Premium Logo Suite
*   **Primary Logo**: The "Cyber Octocat"—A 3D glassmorphism silhouette with a thermal AI aura.
*   **Variant: Molten Git-Coin**: Symbolic of forging high-value architectural decisions.
*   **Variant: Code Phoenix**: Represents the growth that comes from acknowledging coding sins.
*   **Variant: Thermal Git-Web**: Visualizes the "heat" and complexity of modern repository networks.

---

## 💻 Technical Specification

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (Turbopack) / React 19 |
| **Styling** | Tailwind CSS 4 / Shadcn UI |
| **Real-time AI** | Hybrid Groq + SambaNova (Llama-3.1-70B) |
| **Database** | PostgreSQL / Neon.tech |
| **Auth** | Auth.js v5 (Edge Compatible) |
| **PWA** | Custom Service Worker / Web App Manifest |
| **Storage** | Cloudinary Unified Asset Pipeline |

---

## 📂 Project Structure

```text
devroast-ai/
├── src/
│   ├── app/                # Next.js App Router (Routes & APIs)
│   │   ├── api/            # Serverless functions for AI & Integrations
│   │   └── dashboard/      # Core application pages
│   ├── components/         # Atomic UI components & layout
│   ├── lib/                # Shared utilities (AI Engine, Prisma, Auth)
│   └── styles/             # Global CSS & Design Tokens
├── public/                 # Premium Branding Assets & Variants
├── prisma/                 # Database Schema & Migrations
└── types/                  # Type-safe TypeScript definitions
```

---

## 🛠️ Environment Variables Configuration

To run DevRoast AI, you need to configure the following in your `.env`:

```env
# CRITICAL URLS
NEXTAUTH_URL="https://your-domain.com"
AUTH_URL="https://your-domain.com"

# AUTHENTICATION
AUTH_SECRET="your_openssl_32bit_hash"
AUTH_GITHUB_ID="github_client_id"
AUTH_GITHUB_SECRET="github_client_secret"

# AI ACCESS (Separated by commas)
GROQ_API_KEYS="key1,key2,key3"
SAMBANOVA_API_KEYS="key1,key2,key3"

# DATABASE
DATABASE_URL="postgresql://user:pass@host:5432/db"

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## 🗺️ Future Roadmap
- [ ] **Real-world Benchmarking**: Compare your code against open-source repo benchmarks.
- [ ] **Team Roasts**: Analyze team collaboration patterns and "blame" distribution.
- [ ] **IDE Plugin**: Get real-time roasts directly in VS Code while you type.
- [ ] **Video Reel Generation**: Share a high-speed video montage of your repo analysis.

---

<div align="center">
  <p>Engineered for the elite by <a href="https://github.com/Ashwinjauhary">Ashwin Jauhary</a></p>
  <p><strong>DevRoast AI © 2026</strong></p>
</div>

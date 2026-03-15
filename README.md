# DevRoast AI
**Brutally honest, AI-powered GitHub profile & repository analysis.**

DevRoast AI is an intelligent developer analysis platform that evaluates a developer’s GitHub profile and repositories to provide:
- Brutally honest, "savage but useful" AI roasts
- Professional code architecture feedback
- Categorized developer scoring and repo health metrics
- Actionable improvement strategies
- An interactive AI mentor assistant

![Demo Roast Aesthetic]

## MVP Features

- **GitHub OAuth Login:** Securely connect your account via Auth.js to pull live repository data and avoid strict rate limits.
- **Profile Analysis Pipeline:** Scrapes user metrics, parses languages, checks description hygiene, and streams the data to SambaNova AI (using a highly critical strict prompt with Llama 3 70B).
- **Architecture Roasting:** Paste any GitHub URL to receive an architectural grade, identifying "fatal flaws" and quick wins.
- **AI Mentor:** A conversational UI contextually aware of your previous coding sins to help you refactor.
- **History View:** Lifetime roasts are logged locally to a PostgreSQL database via Prisma ORM.
- **Shareable Cards:** Export your developer scorecard directly to PNG using `html2canvas` for easy sharing on social media.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS & Shadcn UI
- **Authentication**: Auth.js v5 (NextAuth) via GitHub/Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **AI Provider**: SambaNova AI (`Meta-Llama-3.1-70B-Instruct`) via OpenAI SDK
- **Animation & Export**: `tailwindcss-animate` & `html2canvas`

## Local Setup & Development

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repo-url>
   cd devroast-ai
   npm install
   ```

2. **Database Configuration:**
   Ensure you have a local PostgreSQL instance running. Create a `.env` file at the root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devroast"
   ```

3. **Provide API Tokens in `.env`:**
   ```env
   # Auth.js Random Hash String
   AUTH_SECRET="your_random_secret_string"
   
   # GitHub OAuth Application (requires `repo` and `read:user` scopes)
   AUTH_GITHUB_ID="your_github_client_id"
   AUTH_GITHUB_SECRET="your_github_client_secret"

   # SambaNova AI Key
   SAMBANOVA_API_KEY="your_sambanova_api_key"
   ```

4. **Initialize Prisma:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to begin the roasting.

## Deployment

This application is fully optimized for Vercel deployment:
1. Connect the GitHub repository directly to Vercel.
2. Under "Environment Variables", inject the production `DATABASE_URL` (from Supabase/Neon), `AUTH_GITHUB_SECRET`, and `SAMBANOVA_API_KEY`.
3. Set `AUTH_URL` to your Vercel production deployment domain.
4. Deploy! Next.js will automatically build the static pages and map the serverless API routes.

---
*DevRoast AI - Remember, your `package.json` is a museum of deprecated dependencies.*

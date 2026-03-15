"use server";

import { auth } from "@/auth";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";
import { prisma } from "@/lib/prisma";
import { fetchRepositories } from "@/app/dashboard/repositories/actions";

export async function fetchResumeContext() {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;
        const githubUsername = (session.user as any).github_username;

        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                analyses: {
                    where: { analysis_type: "repository" },
                    orderBy: { score: 'desc' },
                    take: 5
                }
            }
        });

        const githubReposResult = await fetchRepositories();
        const topRepos = githubReposResult.success ? (githubReposResult.data || []).slice(0, 5) : [];

        return {
            success: true,
            data: {
                name: dbUser?.name || session.user.name || "Developer",
                username: githubUsername,
                email: session.user.email || "",
                projects: dbUser?.analyses.map(a => ({
                   name: a.target,
                   desc: (a.result_json as any)?.summary || "Professional engineer.",
                   tech: (a.result_json as any)?.mainLanguage || "Tech Stack",
                })) || [],
                topRepos: topRepos.map((r: any) => ({
                    name: r.name,
                    desc: r.description,
                    lang: r.language
                }))
            }
        };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function generateResumeLatex(customPrompt: string = "", template: string = "modern") {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;
        const githubUsername = (session.user as any).github_username;

        // 1. Fetch User Data from DB
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                analyses: {
                    where: { analysis_type: "repository" },
                    orderBy: { score: 'desc' },
                    take: 12
                }
            }
        });

        if (!dbUser) throw new Error("User not found");

        // 2. Fetch GitHub Repos (for broader context)
        const githubReposResult = await fetchRepositories();
        const topRepos = githubReposResult.success ? (githubReposResult.data || []).slice(0, 15) : [];

        // 3. Aggregate Language Data
        const langTotals: Record<string, number> = {};
        dbUser.analyses.forEach(a => {
            const json = a.result_json as any;
            const langs: Record<string, number> = json?.languages_breakdown || {};
            Object.entries(langs).forEach(([lang, bytes]) => {
                langTotals[lang] = (langTotals[lang] || 0) + (bytes as number);
            });
        });

        // 4. Prepare Context for AI
        const context = {
            name: dbUser.name,
            username: githubUsername,
            topAnalyses: dbUser.analyses.map(a => ({
                repo: a.target,
                score: a.score,
                summary: (a.result_json as any)?.summary,
                achievements: (a.result_json as any)?.achievements || [],
                tech: (a.result_json as any)?.mainLanguage,
                complexity: (a.result_json as any)?.complexity
            })),
            languages: Object.entries(langTotals).sort((a, b) => b[1] - a[1]).slice(0, 10).map(l => l[0]),
            allRepos: topRepos.map((r: any) => ({
                name: r.name,
                desc: r.description,
                lang: r.language,
                stars: r.stargazers_count,
                topics: r.topics
            }))
        };

        const templateStyle = {
            modern: "Professional centered header, bold section titles with thick horizontal rules, high-density bullet points.",
            executive: "Classic serif, semi-centered, traditional spacing.",
            brutalist: "Monospace accents, industrial dividers, bold impact."
        };

        // 5. SambaNova Prompt
        const prompt = `You are the world's leading 10/10 Engineer Resume Architect. Generate a MASTERPIECE LaTeX document. 
The user is unhappy with "cheap" looking results. Use ONLY the highest level of professional LaTeX engineering.

USER DATA:
${JSON.stringify(context, null, 2)}

STRICT ARCHITECTURAL RULES:
1. PREAMBLE: 
   \\documentclass[10pt]{article}
   \\usepackage[utf8]{inputenc}
   \\usepackage[margin=0.6in]{geometry}
   \\usepackage{enumitem}
   \\usepackage[hidelinks]{hyperref}
   \\usepackage{titlesec}
   \\usepackage{xcolor}
   
   % SECTION STYLING (The "Elite" Look)
   \\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0pt}{}[\\titlerule]
   \\titlespacing{\\section}{0pt}{10pt}{5pt}
   
2. HEADER: 
   \\begin{center}
     {\\Huge \\textbf{${dbUser.name}}} \\\\ \\vspace{2pt}
     {\\large \\textit{Software Engineer $|$ Full Stack Developer}} \\\\ \\vspace{4pt}
     {\\small ${githubUsername}@gmail.com $|$ github.com/${githubUsername} $|$ Location}
   \\end{center}

3. PROJECTS/EXPERIENCE:
   \\noindent \\textbf{Project Name} \\hfill \\href{url}{\\texttt{link}} \\\\
   \\textit{Impact Summary/Role} \\hfill \\textit{Timeline}
   \\begin{itemize}[leftmargin=*, noitemsep, topsep=2pt]
     \\item Use STRICT STAR Method (Situation, Task, Action, Result).
     \\item Every bullet MUST include a quantified result (e.g., "reduced latency by 40%", "increased throughput by 2.5x", "saved 20h/week").
     \\item Start with strong action verbs (Architected, Engineered, Optimized, Spearheaded).
     \\item Example: "Architected a distributed caching layer using Redis, reducing database load by \\textbf{45%} and improving response times from 200ms to \\textbf{45ms}."
   \\end{itemize}
   \\textit{Technologies: Tech 1, Tech 2, Tech 3} \\vspace{10pt}

4. SKILLS:
   \\noindent \\textbf{Category}: Skill 1, Skill 2, Skill 3...

CRITICAL POLISH:
- Use \\textbf{} for all metrics and key technical terms inside bullet points.
- Ensure the outcome is the hero of every bullet.
- Content must be dense, professional, and zero-fluff.
- Use a single page layout (0.6in margins).
- No section headers should be orphaned at the bottom of a page.

BEGIN 1000% PERFECT LATEX:`;

        const latex = await getSambaNovaResponse(prompt);
        
        let cleanedLatex = latex.trim();
        if (cleanedLatex.startsWith("```")) {
            cleanedLatex = cleanedLatex.replace(/^```(latex|tex)?\n?/, "").replace(/\n?```$/, "");
        }

        return { success: true, latex: cleanedLatex };
    } catch (e: any) {
        console.error("Resume Action Error:", e);
        return { success: false, error: e.message };
    }
}

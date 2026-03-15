export interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export const ALL_BADGES: BadgeDefinition[] = [
    { id: "first_blood", name: "First Blood", description: "Ran your first analysis", icon: "🩸", color: "text-red-400" },
    { id: "bug_magnet", name: "Bug Magnet", description: "Got a score below 3.0", icon: "🪲", color: "text-orange-400" },
    { id: "diamond_coder", name: "Diamond Coder", description: "Scored 9.0 or above", icon: "💎", color: "text-blue-400" },
    { id: "ai_whisperer", name: "AI Whisperer", description: "Started 10+ AI chats", icon: "🤖", color: "text-purple-400" },
    { id: "repo_hunter", name: "Repo Hunter", description: "Analyzed 10+ repositories", icon: "📦", color: "text-amber-400" },
    { id: "portfolio_legend", name: "Portfolio Legend", description: "Generated your AI portfolio", icon: "📜", color: "text-cyan-400" },
    { id: "security_sentinel", name: "Security Sentinel", description: "Analyzed a repo with zero security leaks", icon: "🛡️", color: "text-emerald-400" },
    { id: "speed_demon", name: "Speed Demon", description: "Ran 50+ analyses total", icon: "⚡", color: "text-yellow-400" },
    { id: "open_source_champ", name: "OSS Champion", description: "Analyzed a public repository", icon: "🌟", color: "text-green-400" },
    { id: "debt_collector", name: "Debt Collector", description: "Found critical tech debt", icon: "💀", color: "text-zinc-400" },
    { id: "five_star", name: "Five Star Dev", description: "Scored exactly 5.0", icon: "⭐", color: "text-yellow-500" },
    { id: "perfect_ten", name: "Perfect 10", description: "Achieved a score of 10.0", icon: "🏆", color: "text-gold-400" },
    { id: "explorer", name: "Explorer", description: "Analyzed repos in 5+ languages", icon: "🗺️", color: "text-teal-400" },
    { id: "comeback_kid", name: "Comeback Kid", description: "Improved your score by 3+ over time", icon: "🔄", color: "text-sky-400" },
    { id: "code_whisperer", name: "Code Whisperer", description: "Used AI Code Review tool", icon: "🔮", color: "text-violet-400" },
    { id: "readme_king", name: "README King", description: "Generated a README", icon: "📄", color: "text-slate-400" },
    { id: "branch_master", name: "Branch Master", description: "Used the Branch Namer tool", icon: "🌿", color: "text-lime-400" },
    { id: "career_focused", name: "Career Focused", description: "Used the Resume Enhancer", icon: "💼", color: "text-rose-400" },
    { id: "commit_poet", name: "Commit Poet", description: "Audited your commit messages", icon: "✍️", color: "text-fuchsia-400" },
    { id: "licensed", name: "Licensed to Code", description: "Ran a license compliance check", icon: "⚖️", color: "text-indigo-400" },
];

export function computeEarnedBadges(data: {
    analyses: any[];
    chats: any[];
    portfolios: any[];
    existingBadges: string[];
}): string[] {
    const { analyses, chats, portfolios, existingBadges } = data;
    const newBadges = new Set<string>(existingBadges);

    const repoAnalyses = analyses.filter(a => a.analysis_type === 'repository');
    const scores = analyses.map(a => a.score).filter(Boolean);
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 10;

    // First Blood
    if (analyses.length >= 1) newBadges.add("first_blood");

    // Bug Magnet
    if (minScore < 3) newBadges.add("bug_magnet");

    // Diamond Coder
    if (maxScore >= 9) newBadges.add("diamond_coder");

    // Perfect Ten
    if (maxScore >= 10) newBadges.add("perfect_ten");

    // Five Star Dev
    if (scores.some(s => Math.abs(s - 5.0) < 0.1)) newBadges.add("five_star");

    // AI Whisperer
    if (chats.length >= 10) newBadges.add("ai_whisperer");

    // Repo Hunter
    if (repoAnalyses.length >= 10) newBadges.add("repo_hunter");

    // Portfolio Legend
    if (portfolios.length >= 1) newBadges.add("portfolio_legend");

    // Speed Demon
    if (analyses.length >= 50) newBadges.add("speed_demon");

    // Debt Collector (score < 4 on a repo)
    if (repoAnalyses.some(a => a.score < 4)) newBadges.add("debt_collector");

    // Explorer - 5+ different languages (from result_json)
    const langs = new Set<string>();
    repoAnalyses.forEach(a => {
        const json = a.result_json as any;
        if (json?.mainLanguage) langs.add(json.mainLanguage);
    });
    if (langs.size >= 5) newBadges.add("explorer");

    // Comeback Kid - improved score by 3+ over time
    if (scores.length >= 2) {
        const earliest = scores[scores.length - 1];
        const latest = scores[0];
        if (latest - earliest >= 3) newBadges.add("comeback_kid");
    }

    return Array.from(newBadges);
}

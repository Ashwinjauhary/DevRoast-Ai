import { JobCompatibilityResult } from "@/lib/job-compatibility";

export interface HeroData {
    tagline: string;
    about: string;
    vibe?: { title: string; description: string };
    roast?: string;
    achievements?: { label: string; value: string }[];
    roadmap?: (string | { goal: string; phase: string })[];
    techStack?: Record<string, string[]>;
    dnaStats?: { icon: string; label: string; value: string }[];
    status?: string;
    contactEmail?: string;
}

export interface ProjectData {
    title: string;
    description: string;
    techStacks: string[];
    url?: string;
    liveUrl?: string;
    impact?: string;
}

export interface CertificateData {
    id: string;
    title: string;
    file_url: string;
    created_at: string;
}

export interface PortfolioData {
    username: string;
    hero: HeroData;
    skills: string[];
    projects: ProjectData[];
    certificates: CertificateData[];
    template: string;
    experience?: string | { summary: string };
}

export interface PortfolioTemplateProps {
    portfolio: PortfolioData;
    compatibility: JobCompatibilityResult | null;
}

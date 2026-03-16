"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { fetchRepositories, createRepository, updateRepository, deleteRepository, autoImproveDescription, autoImproveReadme, autoFixAnyRepository } from "./actions";
import { Button } from "@/components/ui/button";
import { FolderGit2, Star, GitFork, Eye, Lock, Globe, Trash2, Edit2, Plus, ExternalLink, Loader2, RefreshCcw, CircleDot, Archive, GitBranch, HardDrive, Sparkles, AlignLeft, FileText, Search, X, ChevronDown, SortAsc, Clock, MoveUp, Calendar, Layers } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface GitHubRepository {
    id: number;
    name: string;
    description: string | null;
    private: boolean;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    created_at: string;
    language: string | null;
    size: number;
    fork: boolean;
    archived: boolean;
    homepage: string | null;
    default_branch: string;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export function RepositoryManager({ initialRepos }: { initialRepos: GitHubRepository[] }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Auto-Sync on Focus
        const handleFocus = () => {
            router.refresh();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [router]);

    const [repos, setRepos] = useState<GitHubRepository[]>(initialRepos);

    // Sync state with props when server data changes
    useEffect(() => {
        setRepos(initialRepos);
    }, [initialRepos]);

    const [isCreating, setIsCreating] = useState(false);
    const [editingRepo, setEditingRepo] = useState<GitHubRepository | null>(null);
    const [loadingAction, setLoadingAction] = useState<string | null>(null); // e.g. "create", "delete_repoName"
    const [sortOption, setSortOption] = useState("updated"); // "updated", "stars", "forks", "name", "oldest", "size"
    const [typeOption, setTypeOption] = useState("all"); // "all", "public", "private", "forks", "archived"
    const [searchQuery, setSearchQuery] = useState("");

    // Form States
    const [formData, setFormData] = useState({ name: "", description: "", private: false });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAction("create");
        const toastId = toast.loading("Creating repository...");
        const res = await createRepository(formData);

        if (res.success && res.data) {
            setRepos([res.data, ...repos]);
            setIsCreating(false);
            setFormData({ name: "", description: "", private: false });
            toast.success("Repository created successfully!", { id: toastId });
            router.refresh();
        } else {
            toast.error(res.error || "Failed to create repository", { id: toastId });
        }
        setLoadingAction(null);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRepo) return;
        setLoadingAction("edit");
        const toastId = toast.loading("Updating repository...");

        const res = await updateRepository(editingRepo.owner.login, editingRepo.name, {
            description: formData.description,
            private: formData.private
            // Note: Renaming requires more complex handling for the state update if the name changes,
            // keeping it simple for MVP by allowing editing desc/privacy.
        });

        if (res.success && res.data) {
            setRepos(repos.map(r => r.id === res.data.id ? res.data : r));
            setEditingRepo(null);
            toast.success("Repository updated successfully!", { id: toastId });
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update repository", { id: toastId });
        }
        setLoadingAction(null);
    };

    const handleDelete = async (repo: GitHubRepository) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <p className="text-xs font-black text-white uppercase tracking-tighter">
                    Destroy {repo.name}? <br/>
                    <span className="text-red-400 opacity-80 lowercase font-medium italic">This action is irreversible.</span>
                </p>
                <div className="flex gap-2 justify-end">
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setLoadingAction(`delete_${repo.id}`);
                            const toastId = toast.loading(`Deleting ${repo.name}...`);
                            const res = await deleteRepository(repo.owner.login, repo.name);

                            if (res.success) {
                                setRepos(repos.filter(r => r.id !== repo.id));
                                toast.success(`${repo.name} deleted successfully!`, { id: toastId });
                            } else {
                                toast.error(res.error || "Failed to delete repository", { id: toastId });
                            }
                            setLoadingAction(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all"
                    >
                        Execute Deletion
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: "top-center" });
    };

    const handleAutoImproveDesc = async (repo: GitHubRepository) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <p className="text-xs font-black text-white uppercase tracking-tighter">
                    Neural Enhancement for {repo.name}? <br/>
                    <span className="text-primary opacity-80 lowercase font-medium italic">AI will architect a premium description.</span>
                </p>
                <div className="flex gap-2 justify-end">
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setLoadingAction(`improve_desc_${repo.id}`);
                            const toastId = toast.loading("Generating AI description...");
                            const res = await autoImproveDescription(repo.owner.login, repo.name);

                            if (res.success) {
                                toast.success("Description updated!", { id: toastId });
                                router.refresh();
                                if (res.data) setRepos(repos.map(r => r.id === (res.data as GitHubRepository).id ? (res.data as GitHubRepository) : r));
                            } else {
                                toast.error(res.error || "Failed to auto-improve description.", { id: toastId });
                            }
                            setLoadingAction(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                    >
                        Generate
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: "top-center" });
    };

    const handleAutoImproveReadme = async (repo: GitHubRepository) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <p className="text-xs font-black text-white uppercase tracking-tighter">
                    Generate Architect README for {repo.name}? <br/>
                    <span className="text-primary opacity-80 lowercase font-medium italic">Our AI will deploy a professional README to main.</span>
                </p>
                <div className="flex gap-2 justify-end">
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                    >
                        Skip
                    </button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setLoadingAction(`improve_readme_${repo.id}`);
                            const toastId = toast.loading("Generating AI README...", { id: `readme_${repo.id}` });
                            const result = await autoImproveReadme(repo.owner.login, repo.name);
                            setLoadingAction(null);

                            if (result.success) {
                                toast.success("README upgraded and committed!", { id: toastId });
                                router.refresh();
                            } else {
                                toast.error(result.error || "Failed to upgrade README", { id: toastId });
                            }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                    >
                        Deploy
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: "top-center" });
    };

    const handleAutoFixCode = async (repo: GitHubRepository) => {
        setLoadingAction(`autofix_${repo.id}`);
        const toastId = toast.loading("Analyzing codebase and creating fix issues...", { id: `autofix_${repo.id}` });
        const result = await autoFixAnyRepository(repo.owner.login, repo.name);
        setLoadingAction(null);

        if (result.success) {
            toast.success(result.message || "Fixes generated!", { id: toastId });
        } else {
            toast.error(result.error || "Failed to generate fixes.", { id: toastId });
        }
    };

    const openEditForm = (repo: GitHubRepository) => {
        setEditingRepo(repo);
        setFormData({ name: repo.name, description: repo.description || "", private: repo.private });
    };

    const closeForms = () => {
        setIsCreating(false);
        setEditingRepo(null);
        setFormData({ name: "", description: "", private: false });
    };

    const handleSync = () => {
        setLoadingAction("sync");
        const toastId = toast.loading("Syncing with GitHub...");
        router.refresh();
        setTimeout(() => {
            setLoadingAction(null);
            toast.success("Synchronized", { id: toastId });
        }, 1000);
    };

    const displayRepos = [...repos].filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        if (!matchesSearch) return false;

        if (typeOption === 'public') return !repo.private;
        if (typeOption === 'private') return repo.private;
        if (typeOption === 'forks') return repo.fork;
        if (typeOption === 'archived') return repo.archived;
        if (typeOption === 'empty') return repo.size === 0;
        return true;
    }).sort((a, b) => {
        if (sortOption === "stars") return b.stargazers_count - a.stargazers_count;
        if (sortOption === "forks") return b.forks_count - a.forks_count;
        if (sortOption === "name") return a.name.localeCompare(b.name);
        if (sortOption === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortOption === "size") return b.size - a.size;
        // Default is updated
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    if (!mounted) return null;

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FolderGit2 className="w-8 h-8 text-primary" />
                        Repository Manager
                    </h1>
                    <p className="text-zinc-400 mt-2 font-medium">Create, edit, and destroy your GitHub projects natively.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-between min-w-[140px] bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-white/5 transition-all outline-none focus:border-primary/50">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-zinc-500" />
                                <span>
                                    {typeOption === 'all' && 'Type: All'}
                                    {typeOption === 'public' && 'Public'}
                                    {typeOption === 'private' && 'Private'}
                                    {typeOption === 'forks' && 'Forks'}
                                    {typeOption === 'archived' && 'Archived'}
                                    {typeOption === 'empty' && 'Empty (0 KB)'}
                                </span>
                            </div>
                            <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-zinc-950 border border-white/10 glass-darker">
                            <DropdownMenuItem onClick={() => setTypeOption("all")} className="cursor-pointer gap-2 py-2">
                                <Layers className="w-4 h-4 text-zinc-500" /> All Types
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeOption("public")} className="cursor-pointer gap-2 py-2">
                                <Globe className="w-4 h-4 text-emerald-500" /> Public
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeOption("private")} className="cursor-pointer gap-2 py-2">
                                <Lock className="w-4 h-4 text-amber-500" /> Private
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeOption("forks")} className="cursor-pointer gap-2 py-2">
                                <GitFork className="w-4 h-4 text-blue-500" /> Forks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeOption("archived")} className="cursor-pointer gap-2 py-2">
                                <Archive className="w-4 h-4 text-rose-500" /> Archived
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeOption("empty")} className="cursor-pointer gap-2 py-2">
                                <CircleDot className="w-4 h-4 text-zinc-500" /> Empty (0 KB)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-between min-w-[180px] bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-white/5 transition-all outline-none focus:border-primary/50">
                            <div className="flex items-center gap-2">
                                <SortAsc className="w-4 h-4 text-zinc-500" />
                                <span>
                                    {sortOption === 'updated' && 'Sort: Updated'}
                                    {sortOption === 'name' && 'Name (A-Z)'}
                                    {sortOption === 'stars' && 'Most Stars'}
                                    {sortOption === 'forks' && 'Most Forks'}
                                    {sortOption === 'oldest' && 'Oldest First'}
                                    {sortOption === 'size' && 'Largest Size'}
                                </span>
                            </div>
                            <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-zinc-950 border border-white/10 glass-darker">
                            <DropdownMenuItem onClick={() => setSortOption("updated")} className="cursor-pointer gap-2 py-2">
                                <Clock className="w-4 h-4 text-blue-400" /> Recently Updated
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOption("name")} className="cursor-pointer gap-2 py-2">
                                <AlignLeft className="w-4 h-4 text-zinc-400" /> Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOption("stars")} className="cursor-pointer gap-2 py-2">
                                <Star className="w-4 h-4 text-amber-400" /> Most Stars
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOption("forks")} className="cursor-pointer gap-2 py-2">
                                <GitFork className="w-4 h-4 text-emerald-400" /> Most Forks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOption("oldest")} className="cursor-pointer gap-2 py-2">
                                <Calendar className="w-4 h-4 text-rose-400" /> Oldest First
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOption("size")} className="cursor-pointer gap-2 py-2">
                                <HardDrive className="w-4 h-4 text-indigo-400" /> Largest Size
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        onClick={handleSync}
                        disabled={loadingAction === "sync"}
                        className="gap-2 font-bold border-white/10 hover:bg-white/5"
                    >
                        <RefreshCcw className={`w-4 h-4 ${loadingAction === "sync" ? 'animate-spin' : ''}`} /> Sync
                    </Button>
                    <Button
                        onClick={() => { setIsCreating(true); setEditingRepo(null); setFormData({ name: "", description: "", private: false }); }}
                        className="gap-2 font-bold bg-primary text-black hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4" /> New Repository
                    </Button>
                </div>
            </div>

            {/* Search Bar Section */}
            <div className="relative group max-w-2xl">
                <div className="absolute inset-0 bg-primary/5 blur-2xl group-focus-within:bg-primary/10 transition-all rounded-full" />
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search for a specific repository by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700 glass-darker"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 p-1 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Modal Overlay for Create/Edit */}
            {mounted && createPortal(
                <AnimatePresence>
                    {(isCreating || editingRepo) && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl glass-darker"
                            >
                                <div className="p-6 border-b border-white/5 bg-white/2">
                                    <h2 className="text-xl font-black text-white">
                                        {isCreating ? "Create New Repository" : `Edit ${editingRepo?.name}`}
                                    </h2>
                                </div>
                                <form onSubmit={isCreating ? handleCreate : handleUpdate} className="p-6 space-y-6">
                                    {isCreating && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Repository Name *</label>
                                            <input
                                                required
                                                disabled={loadingAction !== null}
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/\s+/g, '-') })}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                                                placeholder="e.g. awesome-project"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
                                        <textarea
                                            disabled={loadingAction !== null}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none h-24"
                                            placeholder="What is this repository about?"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-white/2 border border-white/5 rounded-xl cursor-pointer" onClick={() => setFormData({ ...formData, private: !formData.private })}>
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${formData.private ? 'bg-primary border-primary' : 'border-zinc-600'}`}>
                                            {formData.private && <Lock className="w-3 h-3 text-black font-bold" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Private Repository</p>
                                            <p className="text-xs text-zinc-500">Only you can see and commit to this repository.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-white/5">
                                        <Button type="button" variant="outline" onClick={closeForms} className="flex-1" disabled={loadingAction !== null}>Cancel</Button>
                                        <Button type="submit" className="flex-1 bg-primary text-black hover:bg-primary/90" disabled={loadingAction !== null}>
                                            {loadingAction === "create" || loadingAction === "edit" ? <Loader2 className="w-4 h-4 animate-spin" /> : isCreating ? "Create Repo" : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {displayRepos.map((repo) => (
                        <PremiumCard 
                            key={repo.id} 
                            layout
                            className="flex flex-col group h-full relative overflow-hidden min-h-[220px]"
                        >
                        {repo.archived && (
                            <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-bl-xl border-b border-l border-yellow-500/20 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 backdrop-blur-md">
                                <Archive className="w-3 h-3" /> Archived
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-4 mt-2">
                            <div className="flex items-center gap-2 max-w-[70%]">
                                {repo.private ? <Lock className="w-4 h-4 text-zinc-500 shrink-0" /> : repo.fork ? <GitFork className="w-4 h-4 text-zinc-500 shrink-0" /> : <Globe className="w-4 h-4 text-zinc-500 shrink-0" />}
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-white truncate hover:text-primary transition-colors flex flex-col">
                                    <span className="truncate">{repo.name}</span>
                                </a>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        disabled={loadingAction === `improve_desc_${repo.id}` || loadingAction === `improve_readme_${repo.id}` || loadingAction === `autofix_${repo.id}`}
                                        className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer data-disabled:opacity-50 data-disabled:cursor-not-allowed border-none outline-none"
                                        title="Auto Improve with AI"
                                    >
                                        {(loadingAction === `improve_desc_${repo.id}` || loadingAction === `improve_readme_${repo.id}` || loadingAction === `autofix_${repo.id}`)
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <Sparkles className="w-4 h-4" />
                                        }
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-zinc-950 border border-white/10" align="end">
                                        <DropdownMenuItem onClick={() => handleAutoImproveDesc(repo)} className="cursor-pointer text-zinc-300 hover:text-white focus:bg-white/10 focus:text-white py-2">
                                            <AlignLeft className="w-4 h-4 mr-2" />
                                            Enhance Description
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAutoImproveReadme(repo)} className="cursor-pointer text-zinc-300 hover:text-white focus:bg-white/10 focus:text-white py-2">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Generate README
                                        </DropdownMenuItem>
                                        <div className="h-px bg-white/10 my-1"></div>
                                        <DropdownMenuItem onClick={() => handleAutoFixCode(repo)} className="cursor-pointer font-bold text-emerald-400 hover:text-emerald-300 focus:bg-emerald-500/10 focus:text-emerald-300 py-2">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Auto-Fix Codebase
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button onClick={() => openEditForm(repo)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Edit Repo">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(repo)}
                                    disabled={loadingAction === `delete_${repo.id}`}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                                    title="Delete Repo"
                                >
                                    {loadingAction === `delete_${repo.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {repo.size === 0 && (
                            <div className="mb-4 flex items-center gap-2 px-3 py-1.5 bg-zinc-500/5 border border-zinc-500/10 rounded-xl w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">GHOST_REPO: ZERO_COMMIT_FLOW</span>
                            </div>
                        )}

                        <p className="text-sm text-zinc-400 mb-4 flex-1 line-clamp-2">
                            {repo.description || <span className="italic text-zinc-600">No description provided.</span>}
                        </p>

                        {/* Extra Metadata Row */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                            {repo.homepage && (
                                <a href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                    <ExternalLink className="w-3 h-3" /> Live
                                </a>
                            )}
                            {repo.default_branch && (
                                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                                    <GitBranch className="w-3 h-3" /> {repo.default_branch}
                                </div>
                            )}
                            {repo.size > 0 && (
                                <div className="flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" /> {(repo.size / 1024).toFixed(1)} MB
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-auto pt-4 border-t border-white/5">
                            {repo.language && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {repo.language}
                                </div>
                            )}
                            <div className="flex items-center gap-1" title="Stars">
                                <Star className="w-3.5 h-3.5" />
                                {repo.stargazers_count}
                            </div>
                            <div className="flex items-center gap-1" title="Forks">
                                <GitFork className="w-3.5 h-3.5" />
                                {repo.forks_count}
                            </div>
                            <a href={`${repo.html_url}/issues`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors ml-auto" title="Open Issues">
                                <CircleDot className="w-3.5 h-3.5" />
                                {repo.open_issues_count}
                            </a>
                        </div>
                    </PremiumCard>
                ))}
                </AnimatePresence>
            </motion.div>

            {repos.length === 0 && (
                <div className="py-20 text-center border border-white/5 border-dashed rounded-3xl glass-darker">
                    <FolderGit2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No repositories found</h3>
                    <p className="text-zinc-500">You don't have any repositories yet, or we couldn't fetch them.</p>
                </div>
            )}
        </div>
    );
}

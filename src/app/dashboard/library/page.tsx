"use client";

import { useState, useEffect, useRef } from "react";
import { getSnippets, deleteSnippet, saveSnippet, updateSnippet } from "../snippet-vault/actions";
import { getLibraryAssets, saveLibraryAsset, updateLibraryAsset, deleteLibraryAsset, getCloudinarySignature } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { 
    Save, Trash2, Copy, Plus, X, Code2, Pencil, 
    ChevronDown, Check, FileText, Trophy, BookOpen, 
    ExternalLink, Upload, ImageIcon, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP", "Ruby", "SQL", "Bash", "Other"];
const TABS = [
    { id: "snippets", label: "Snippets", icon: Code2, desc: "Code gems & AI fixes" },
    { id: "notes", label: "Neural Notes", icon: FileText, desc: "Developer logs & research" },
    { id: "achievements", label: "Certificates", icon: Trophy, desc: "Professional proof of work" }
];

export default function NeuralLibraryPage() {
    const [activeTab, setActiveTab] = useState("snippets");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Data states
    const [snippets, setSnippets] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);

    // Form states
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [snippetForm, setSnippetForm] = useState({ title: "", code: "", language: "JavaScript", notes: "" });
    const [assetForm, setAssetForm] = useState({ title: "", content: "", file_url: "" });

    useEffect(() => { load(); }, [activeTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function load() {
        setLoading(true);
        if (activeTab === "snippets") {
            const data = await getSnippets();
            if (data.snippets) setSnippets(data.snippets);
        } else {
            const data = await getLibraryAssets();
            if (data.assets) setAssets(data.assets.filter((a: any) => a.type === (activeTab === "notes" ? "NOTE" : "CERTIFICATE")));
        }
        setLoading(false);
    }

    async function handleSaveSnippet() {
        if (!snippetForm.title || !snippetForm.code) return;
        if (editId) {
            await updateSnippet(editId, snippetForm.title, snippetForm.code, snippetForm.language, snippetForm.notes);
        } else {
            await saveSnippet(snippetForm.title, snippetForm.code, snippetForm.language, snippetForm.notes);
        }
        resetForms();
        await load();
    }

    async function handleSaveAsset() {
        if (!assetForm.title) return;
        const type = activeTab === "notes" ? "NOTE" : "CERTIFICATE";
        if (editId) {
            await updateLibraryAsset(editId, assetForm.title, assetForm.content, assetForm.file_url);
        } else {
            await saveLibraryAsset(type, assetForm.title, assetForm.content, assetForm.file_url);
        }
        resetForms();
        await load();
    }

    function resetForms() {
        setSnippetForm({ title: "", code: "", language: "JavaScript", notes: "" });
        setAssetForm({ title: "", content: "", file_url: "" });
        setEditId(null);
        setShowForm(false);
    }

    async function handleDelete(id: string) {
        if (activeTab === "snippets") {
            await deleteSnippet(id);
        } else {
            await deleteLibraryAsset(id);
        }
        load();
    }

    function handleEdit(item: any) {
        if (activeTab === "snippets") {
            setSnippetForm({
                title: item.title,
                code: item.code,
                language: item.language,
                notes: item.notes || ""
            });
        } else {
            setAssetForm({
                title: item.title,
                content: item.content || "",
                file_url: item.file_url || ""
            });
        }
        setEditId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleUpload(file: File) {
        try {
            const sigData: any = await getCloudinarySignature();
            if (sigData.error) throw new Error(sigData.error);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", sigData.apiKey);
            formData.append("timestamp", sigData.timestamp);
            formData.append("signature", sigData.signature);
            formData.append("folder", "devroast_library");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/upload`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.secure_url) {
                setAssetForm(p => ({ ...p, file_url: data.secure_url }));
                return data.secure_url;
            }
        } catch (error) {
            console.error("Upload failed", error);
        }
        return null;
    }

    function handleCopy(id: string, text: string) {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-primary">
                        <BookOpen className="w-8 h-8" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Neural Archives</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white">The Library</h1>
                    <p className="text-xl text-zinc-500 italic max-w-xl">
                        A centralized repository for your code fragments, research notes, and professional achievements.
                    </p>
                </div>
                
                <button
                    onClick={() => {
                        if (showForm) resetForms();
                        else setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 self-start md:self-auto"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? "Cancel" : `Add ${activeTab === 'snippets' ? 'Snippet' : activeTab === 'notes' ? 'Note' : 'Certificate'}`}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white/[0.03] border border-white/10 rounded-3xl w-fit">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); resetForms(); }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all duration-500 ${
                                isActive 
                                ? "bg-white/10 text-white shadow-xl border border-white/10" 
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                            <span className="uppercase tracking-widest text-[10px]">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Form Section */}
            <AnimatePresence mode="wait">
                {showForm && (
                    <motion.div
                        key={activeTab + "-form"}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="mb-8"
                    >
                        <PremiumCard glowColor="primary">
                            <div className="space-y-6 p-2">
                                <h3 className="font-black tracking-tight text-2xl">
                                    {editId ? `Edit ${TABS.find(t => t.id === activeTab)?.label}` : `New ${TABS.find(t => t.id === activeTab)?.label}`}
                                </h3>

                                {activeTab === "snippets" ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Snippet Title (e.g., Auth Middleware Fix)"
                                                value={snippetForm.title}
                                                onChange={e => setSnippetForm(p => ({ ...p, title: e.target.value }))}
                                                className="col-span-2 md:col-span-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                            <div className="relative" ref={dropdownRef}>
                                                <button
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all font-bold uppercase tracking-widest text-[10px]"
                                                >
                                                    {snippetForm.language}
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {isDropdownOpen && (
                                                        <motion.div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl py-2 max-h-64 overflow-y-auto custom-scrollbar">
                                                            {LANGUAGES.map(lang => (
                                                                <button key={lang} onClick={() => { setSnippetForm(p => ({ ...p, language: lang })); setIsDropdownOpen(false); }} className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white/5 transition-colors">
                                                                    <span className="font-bold uppercase tracking-widest text-[10px]">{lang}</span>
                                                                    {snippetForm.language === lang && <Check className="w-4 h-4 text-primary" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Paste the code gem here..."
                                            value={snippetForm.code}
                                            onChange={e => setSnippetForm(p => ({ ...p, code: e.target.value }))}
                                            rows={12}
                                            className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-6 text-zinc-300 font-mono text-sm focus:outline-none focus:border-primary/30 transition-all resize-none shadow-inner"
                                        />
                                        <input
                                            placeholder="Internal Notes (context, performance, etc.)..."
                                            value={snippetForm.notes}
                                            onChange={e => setSnippetForm(p => ({ ...p, notes: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                ) : activeTab === "notes" ? (
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Research/Note Title..."
                                            value={assetForm.title}
                                            onChange={e => setAssetForm(p => ({ ...p, title: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors font-bold"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="note-pdf-upload"
                                                    className="hidden"
                                                    accept=".pdf"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await handleUpload(file);
                                                            if (url) { /* URL set in handleUpload */ }
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="note-pdf-upload"
                                                    className="flex items-center gap-4 bg-white/5 border border-dashed border-white/10 rounded-xl px-4 py-4 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                                                >
                                                    <Upload className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Attach Research PDF</span>
                                                        <span className="text-[9px] text-zinc-500 font-bold">{assetForm.file_url ? 'PDF Linked ✅' : 'Max 5MB'}</span>
                                                    </div>
                                                </label>
                                            </div>
                                            {assetForm.file_url && (
                                                <div className="flex items-center gap-3 px-4 py-4 bg-primary/10 border border-primary/20 rounded-xl">
                                                    <div className="p-2 bg-primary/20 rounded-lg">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white truncate">Attached Asset</span>
                                                        <button onClick={() => setAssetForm(p => ({ ...p, file_url: "" }))} className="text-[9px] text-primary hover:text-white transition-colors font-bold uppercase text-left">Remove</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <textarea
                                            placeholder="Write your research or notes here... (Markdown supported)"
                                            value={assetForm.content}
                                            onChange={e => setAssetForm(p => ({ ...p, content: e.target.value }))}
                                            rows={12}
                                            className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-6 text-zinc-300 font-sans text-sm focus:outline-none focus:border-primary/30 transition-all resize-none shadow-inner leading-relaxed"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Certificate/Achievement Name (e.g., AWS Developer Associate)"
                                            value={assetForm.title}
                                            onChange={e => setAssetForm(p => ({ ...p, title: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors font-bold"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <input
                                                    placeholder="Certificate Link / URL..."
                                                    value={assetForm.file_url}
                                                    onChange={e => setAssetForm(p => ({ ...p, file_url: e.target.value }))}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors pl-12"
                                                />
                                                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="cert-upload"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await handleUpload(file);
                                                            if (url) {
                                                                // URL already set in assetForm by handleUpload
                                                            }
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="cert-upload"
                                                    className="flex items-center gap-4 bg-white/5 border border-dashed border-white/10 rounded-xl px-4 py-4 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                                                >
                                                    <Upload className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload Certificate</span>
                                                        <span className="text-[9px] text-zinc-500 font-bold">PDF, PNG, JPG (Max 5MB)</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Achievement Description / Why it matters..."
                                            value={assetForm.content}
                                            onChange={e => setAssetForm(p => ({ ...p, content: e.target.value }))}
                                            rows={4}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-6 text-zinc-300 font-sans text-sm focus:outline-none focus:border-primary/30 transition-all resize-none"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end pt-4 gap-4">
                                    <button onClick={resetForms} className="px-6 py-3 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                                        Discard
                                    </button>
                                    <button 
                                        onClick={activeTab === 'snippets' ? handleSaveSnippet : handleSaveAsset} 
                                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                                    >
                                        <Save className="w-4 h-4" /> {editId ? "Update Asset" : "Save to Vault"}
                                    </button>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List Section */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-20 text-center opacity-30 animate-pulse">
                        <Cpu className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="font-black uppercase tracking-[0.4em] text-sm">Synchronizing Database...</p>
                    </div>
                ) : activeTab === "snippets" ? (
                    <div className="space-y-4">
                        {snippets.length === 0 && (
                            <div className="py-20 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[3rem]">
                                <Code2 className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest text-sm">No Snippets Found</p>
                            </div>
                        )}
                        {snippets.map(snippet => (
                            <PremiumCard key={snippet.id} glowColor="none">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-black text-xl text-white tracking-tight">{snippet.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded">{snippet.language}</span>
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(snippet.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(snippet)} className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                                                <Pencil className="w-4 h-4 text-zinc-500 hover:text-primary transition-colors" />
                                            </button>
                                            <button onClick={() => handleCopy(snippet.id, snippet.code)} className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                                                <Copy className={`w-4 h-4 ${copiedId === snippet.id ? "text-emerald-400" : "text-zinc-500"}`} />
                                            </button>
                                            <button onClick={() => handleDelete(snippet.id)} className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/10">
                                                <Trash2 className="w-4 h-4 text-zinc-600 hover:text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <pre className="text-xs font-mono text-zinc-300 bg-black/60 rounded-2xl p-6 overflow-x-auto max-h-64 border border-white/5 shadow-inner">
                                        {snippet.code}
                                    </pre>
                                    {snippet.notes && (
                                        <div className="flex items-start gap-2 text-xs text-zinc-500 italic bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                            <FileText className="w-3.5 h-3.5 mt-0.5" />
                                            <span>{snippet.notes}</span>
                                        </div>
                                    )}
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {assets.length === 0 && (
                            <div className="col-span-full py-20 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[3rem]">
                                {activeTab === 'notes' ? <FileText className="w-16 h-16 mx-auto mb-4" /> : <Trophy className="w-16 h-16 mx-auto mb-4" />}
                                <p className="font-black uppercase tracking-widest text-sm">Neural Vault Empty</p>
                            </div>
                        )}
                        {assets.map(asset => (
                            <PremiumCard key={asset.id} glowColor={activeTab === 'achievements' ? 'primary' : 'none'}>
                                <div className="space-y-4 h-full flex flex-col">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-black text-lg text-white tracking-tight leading-tight">{asset.title}</h3>
                                            <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{new Date(asset.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEdit(asset)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <Pencil className="w-3.5 h-3.5 text-zinc-600" />
                                            </button>
                                            <button onClick={() => handleDelete(asset.id)} className="p-2 hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className="w-3.5 h-3.5 text-zinc-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {activeTab === "notes" ? (
                                        <div className="flex-1 space-y-4">
                                            <p className="text-sm text-zinc-400 font-sans line-clamp-4 leading-relaxed whitespace-pre-wrap">
                                                {asset.content}
                                            </p>
                                            {asset.file_url && (
                                                <a 
                                                    href={asset.file_url} 
                                                    target="_blank" 
                                                    className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
                                                >
                                                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">View Attached Research</span>
                                                    <ExternalLink className="w-3 h-3 ml-auto opacity-30 group-hover:opacity-100" />
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4 flex-1 flex flex-col">
                                            {asset.file_url ? (
                                                <div className="aspect-[4/3] w-full bg-[#050505] rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl">
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        {asset.file_url.toLowerCase().endsWith('.pdf') ? (
                                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                                <FileText className="w-16 h-16 text-primary" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">PDF Preview Restricted</span>
                                                            </div>
                                                        ) : (
                                                            <img 
                                                                src={asset.file_url} 
                                                                alt={asset.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                                            />
                                                        )}
                                                    </div>
                                                    
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                                    
                                                    <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                                                        <a 
                                                            href={asset.file_url} 
                                                            target="_blank" 
                                                            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                            Open Full Evidence
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-[4/3] w-full bg-black/40 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
                                                    <Trophy className="w-16 h-16 text-zinc-900 group-hover:text-primary/20 transition-colors" />
                                                </div>
                                            )}
                                            {asset.content && <p className="text-xs text-zinc-500 font-medium italic text-center px-2 line-clamp-2 mt-auto">{asset.content}</p>}
                                        </div>
                                    )}
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

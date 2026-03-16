"use client";

import { useState, useEffect, useRef } from "react";
import { getSnippets, deleteSnippet, saveSnippet, updateSnippet } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { Save, Trash2, Copy, Plus, X, Code2, Pencil, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP", "Ruby", "SQL", "Bash", "Other"];

export default function SnippetVaultPage() {
    const [snippets, setSnippets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", code: "", language: "JavaScript", notes: "" });
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => { load(); }, []);

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
        const data = await getSnippets();
        if (data.snippets) setSnippets(data.snippets);
        setLoading(false);
    }

    async function handleSave() {
        if (!form.title || !form.code) return;
        if (editId) {
            await updateSnippet(editId, form.title, form.code, form.language, form.notes);
        } else {
            await saveSnippet(form.title, form.code, form.language, form.notes);
        }
        setForm({ title: "", code: "", language: "JavaScript", notes: "" });
        setEditId(null);
        setShowForm(false);
        await load();
    }

    async function handleDelete(id: string) {
        await deleteSnippet(id);
        setSnippets(prev => prev.filter(s => s.id !== id));
    }

    function handleEdit(snippet: any) {
        setForm({
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
            notes: snippet.notes || ""
        });
        setEditId(snippet.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleCopy(id: string, code: string) {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <h1 className="text-5xl font-black tracking-tighter text-white">Snippet Vault</h1>
                    <p className="text-xl text-zinc-500 italic">Save AI-generated fixes and code gems. Never lose them again.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            setEditId(null);
                            setForm({ title: "", code: "", language: "JavaScript", notes: "" });
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? "Cancel" : "New Snippet"}
                </button>
            </div>

            {showForm && (
                <PremiumCard glowColor="primary">
                    <div className="space-y-5">
                        <h3 className="font-black tracking-tight text-lg">{editId ? "Edit Snippet" : "Save New Snippet"}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Title..."
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                className="col-span-2 md:col-span-1 bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            
                            {/* Custom Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                                >
                                    <span className="font-medium">{form.language}</span>
                                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                                        >
                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {LANGUAGES.map(lang => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => {
                                                            setForm(p => ({ ...p, language: lang }));
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${form.language === lang ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                                                    >
                                                        <span className="font-bold uppercase tracking-widest text-[10px]">{lang}</span>
                                                        {form.language === lang && <Check className="w-3.5 h-3.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <textarea
                            placeholder="Paste your code here..."
                            value={form.code}
                            onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
                            rows={8}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-zinc-300 font-mono text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                        />
                        <input
                            placeholder="Notes (optional)..."
                            value={form.notes}
                            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                            className="w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                            <Save className="w-4 h-4" /> {editId ? "Update Snippet" : "Save Snippet"}
                        </button>
                    </div>
                </PremiumCard>
            )}

            {loading ? (
                <div className="py-20 text-center opacity-30"><Code2 className="w-12 h-12 mx-auto mb-4" /><p className="font-black tracking-widest">Loading vault...</p></div>
            ) : snippets.length === 0 ? (
                <div className="py-20 text-center opacity-30 space-y-2">
                    <Code2 className="w-12 h-12 mx-auto" />
                    <p className="font-black uppercase tracking-widest text-sm">Vault is empty — save your first snippet!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {snippets.map(snippet => (
                        <PremiumCard key={snippet.id} glowColor="none">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-black text-white">{snippet.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded">{snippet.language}</span>
                                            <span className="text-[10px] text-zinc-600">{new Date(snippet.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(snippet)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                            <Pencil className="w-4 h-4 text-zinc-500 hover:text-primary transition-colors" />
                                        </button>
                                        <button onClick={() => handleCopy(snippet.id, snippet.code)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                            <Copy className={`w-4 h-4 ${copiedId === snippet.id ? "text-emerald-400" : "text-zinc-500"}`} />
                                        </button>
                                        <button onClick={() => handleDelete(snippet.id)} className="p-2 hover:bg-red-500/10 rounded-xl transition-colors">
                                            <Trash2 className="w-4 h-4 text-zinc-600 hover:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                                <pre className="text-xs font-mono text-zinc-300 bg-black/40 rounded-xl p-4 overflow-x-auto max-h-48 border border-white/5">
                                    {snippet.code}
                                </pre>
                                {snippet.notes && <p className="text-xs text-zinc-500 italic">{snippet.notes}</p>}
                            </div>
                        </PremiumCard>
                    ))}
                </div>
            )}
        </div>
    );
}

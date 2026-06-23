const fs = require('fs');

let dashboardPage = fs.readFileSync('src/app/dashboard/portfolio/page.tsx', 'utf8');

const newTemplates = `
        { id: "glass3d", name: "Glassmorphic 3D", desc: "Glassy backgrounds with 3D depth.", color: "cyan-400" },
        { id: "bento", name: "Bento Box", desc: "Apple-inspired, grid-based layout.", color: "slate-200" },
        { id: "aurora", name: "Aurora Mesh", desc: "Premium animated gradient blobs.", color: "indigo-400" },
        { id: "clay", name: "Claymorphism", desc: "Friendly, soft, inflated 3D elements.", color: "amber-300" },
        { id: "spatial", name: "Spatial", desc: "Translucent, deep-blurred glass.", color: "purple-400" },
        { id: "neo", name: "Neo-Brutalism", desc: "Thick borders, flat vibrant colors.", color: "orange-400" },
        { id: "swiss", name: "Swiss Style", desc: "Massive typography, strict alignment.", color: "red-500" },
        { id: "fluid", name: "Fluid Gradient", desc: "Liquid, smooth flowing gradients.", color: "sky-400" },
        { id: "dark_minimal", name: "Dark Minimalist", desc: "Pitch black, high contrast.", color: "zinc-300" },
        { id: "synthwave", name: "Synthwave", desc: "80s retro-futuristic, neon grids.", color: "pink-500" },
`;

// Insert into templates array
dashboardPage = dashboardPage.replace(
    /({ id: "aura", name: "Crystal Aura", desc: "Soft, glowing, ethereal design.", color: "violet-400" },)/,
    `$1${newTemplates}`
);

// Insert into color block in dashboard/portfolio/page.tsx
dashboardPage = dashboardPage.replace(
    /template === 'hacker' \? 'bg-emerald-500\/20 text-emerald-400' :/,
    `template === 'hacker' ? 'bg-emerald-500/20 text-emerald-400' :
                            template === 'glass3d' ? 'bg-cyan-500/20 text-cyan-400' :
                            template === 'bento' ? 'bg-slate-200 text-slate-800' :
                            template === 'aurora' ? 'bg-indigo-500/20 text-indigo-400' :
                            template === 'clay' ? 'bg-amber-300 text-amber-900' :
                            template === 'spatial' ? 'bg-purple-500/20 text-purple-400' :
                            template === 'neo' ? 'bg-orange-400 text-black' :
                            template === 'swiss' ? 'bg-red-500 text-white' :
                            template === 'fluid' ? 'bg-sky-500/20 text-sky-400' :
                            template === 'dark_minimal' ? 'bg-zinc-800 text-zinc-300' :
                            template === 'synthwave' ? 'bg-pink-500/20 text-pink-400' :`
);

fs.writeFileSync('src/app/dashboard/portfolio/page.tsx', dashboardPage);
console.log('Updated dashboard page');

let publicPage = fs.readFileSync('src/app/portfolio/[username]/page.tsx', 'utf8');

function injectTernaryStr(findStr, injection) {
    publicPage = publicPage.replace(findStr, `${injection} ${findStr}`);
}

// 1. Wrapper background
injectTernaryStr(
    "'bg-[#050505] text-zinc-100'",
    `template === 'glass3d' ? 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#000000] text-zinc-100' :
            template === 'bento' ? 'bg-[#f3f4f6] text-slate-900' :
            template === 'aurora' ? 'bg-[#0f172a] text-zinc-100' :
            template === 'clay' ? 'bg-[#f1f3f6] text-slate-800' :
            template === 'spatial' ? 'bg-[radial-gradient(circle_at_20%_30%,#4a2b66_0%,#0d0e15_50%,#111_100%)] text-zinc-100' :
            template === 'neo' ? 'bg-[#fff0db] text-black font-sans' :
            template === 'swiss' ? 'bg-[#e30513] text-white font-sans' :
            template === 'fluid' ? 'bg-gradient-to-br from-[#84fab0] to-[#8fd3f4] text-black' :
            template === 'dark_minimal' ? 'bg-black text-white' :
            template === 'synthwave' ? 'bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-pink-400 font-sans' :`
);

// 2. Background effects
const bgEffects = `
            {template === 'glass3d' && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
                </div>
            )}
            {template === 'aurora' && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-[70%] h-[70%] bg-[radial-gradient(circle,rgba(139,92,246,0.4)_0%,transparent_60%)] blur-[60px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
                    <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(236,72,153,0.4)_0%,transparent_60%)] blur-[60px] animate-[pulse_12s_ease-in-out_infinite_alternate_reverse]" />
                </div>
            )}
            {template === 'synthwave' && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute bottom-0 left-[-50%] w-[200%] h-[50%] bg-[linear-gradient(transparent_65%,#ff007f_65%),linear-gradient(90deg,transparent_65%,#00ffff_65%)] bg-[size:30px_30px] [transform:perspective(500px)_rotateX(60deg)] animate-[pulse_4s_linear_infinite]" />
                </div>
            )}
`;
publicPage = publicPage.replace(
    "{/* Layout Wrapper */}",
    `${bgEffects}\n            {/* Layout Wrapper */}`
);

// 3. Layout classes (hacker/blueprint/bento)
injectTernaryStr(
    "'max-w-4xl mx-auto px-6 py-24 space-y-32'",
    `template === 'bento' ? 'max-w-6xl mx-auto px-4 py-12 space-y-8' :
                      template === 'swiss' ? 'max-w-5xl mx-auto px-8 py-24 border-l-8 border-white' :`
);

// 4. Hero section (grid/bento)
injectTernaryStr(
    "'space-y-8'",
    `template === 'bento' ? 'bg-white rounded-3xl p-8 shadow-sm border border-slate-100' :
                            template === 'clay' ? 'bg-[#fafafa] rounded-[32px] p-10 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff,inset_4px_4px_8px_rgba(255,255,255,0.5),inset_-4px_-4px_8px_rgba(0,0,0,0.05)]' :
                            template === 'neo' ? 'bg-white border-4 border-black p-8 shadow-[12px_12px_0px_#000]' :`
);

// 5. Github Badge
injectTernaryStr(
    "'bg-white/5 border border-white/10 text-zinc-400'",
    `template === 'glass3d' ? 'bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300' :
                                    template === 'bento' ? 'bg-slate-100 text-slate-600' :
                                    template === 'aurora' ? 'bg-white/5 backdrop-blur-xl border border-white/10 text-fuchsia-300' :
                                    template === 'clay' ? 'bg-[#fbbf24] text-amber-900 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.1),4px_4px_8px_rgba(0,0,0,0.1)]' :
                                    template === 'spatial' ? 'bg-black/30 border border-white/10 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' :
                                    template === 'neo' ? 'bg-[#b19cd9] text-black border-2 border-black font-bold shadow-[4px_4px_0_#000]' :
                                    template === 'swiss' ? 'bg-white text-black font-bold rounded-none' :
                                    template === 'fluid' ? 'bg-white/50 backdrop-blur-md text-black' :
                                    template === 'dark_minimal' ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-none' :
                                    template === 'synthwave' ? 'bg-transparent border-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_#00ffff,inset_0_0_10px_#00ffff]' :`
);

// 6. H1 text
injectTernaryStr(
    "'text-5xl md:text-8xl'",
    `template === 'glass3d' ? 'text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]' :
                                    template === 'bento' ? 'text-4xl md:text-6xl font-black tracking-tight text-slate-900' :
                                    template === 'aurora' ? 'text-5xl md:text-8xl text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]' :
                                    template === 'clay' ? 'text-5xl md:text-8xl font-black text-slate-800 drop-shadow-[2px_4px_6px_rgba(0,0,0,0.1)]' :
                                    template === 'spatial' ? 'text-5xl md:text-8xl text-white font-light tracking-tight drop-shadow-2xl' :
                                    template === 'neo' ? 'text-5xl md:text-8xl font-black text-black uppercase tracking-tighter' :
                                    template === 'swiss' ? 'text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none' :
                                    template === 'fluid' ? 'text-5xl md:text-8xl font-black text-black mix-blend-overlay' :
                                    template === 'dark_minimal' ? 'text-5xl md:text-8xl font-light tracking-tighter text-white' :
                                    template === 'synthwave' ? 'text-5xl md:text-8xl font-black text-pink-500 uppercase tracking-widest drop-shadow-[0_0_10px_#ff007f]' :`
);

// 7. About Text
injectTernaryStr(
    "'text-zinc-400'",
    `template === 'glass3d' ? 'text-cyan-100/80 font-medium' :
                                    template === 'bento' ? 'text-slate-600' :
                                    template === 'aurora' ? 'text-white/70' :
                                    template === 'clay' ? 'text-slate-600 font-medium' :
                                    template === 'spatial' ? 'text-white/80 font-light' :
                                    template === 'neo' ? 'text-black font-bold text-2xl border-4 border-black p-4 bg-white shadow-[8px_8px_0_#000]' :
                                    template === 'swiss' ? 'text-white font-bold text-2xl max-w-2xl' :
                                    template === 'fluid' ? 'text-black/70 font-medium' :
                                    template === 'dark_minimal' ? 'text-zinc-500 font-light' :
                                    template === 'synthwave' ? 'text-cyan-400 font-mono tracking-wider' :`
);

// 8. Archetype
injectTernaryStr(
    "'bg-white/5 border-white/10'",
    `template === 'glass3d' ? 'bg-white/10 backdrop-blur-lg border-white/20 shadow-xl' :
                                            template === 'bento' ? 'bg-slate-100 border-transparent text-slate-800' :
                                            template === 'aurora' ? 'bg-white/5 backdrop-blur-2xl border-white/10' :
                                            template === 'clay' ? 'bg-[#fbbf24] text-amber-900 border-transparent shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.1),4px_4px_8px_rgba(0,0,0,0.1)]' :
                                            template === 'spatial' ? 'bg-white/5 backdrop-blur-3xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-white' :
                                            template === 'neo' ? 'bg-[#ff90e8] border-4 border-black shadow-[8px_8px_0_#000] text-black rounded-none' :
                                            template === 'swiss' ? 'bg-black text-white border-none rounded-none' :
                                            template === 'fluid' ? 'bg-white/40 backdrop-blur-md text-black border-white/50' :
                                            template === 'dark_minimal' ? 'bg-black border-zinc-800 text-white rounded-none' :
                                            template === 'synthwave' ? 'bg-black/50 border-2 border-pink-500 text-pink-500 shadow-[0_0_15px_#ff007f]' :`
);

// 9. Roast
injectTernaryStr(
    "'bg-white/5 border-white/10 text-zinc-400'",
    `template === 'glass3d' ? 'bg-red-500/10 border-red-500/30 text-red-200 backdrop-blur-md' :
                                        template === 'bento' ? 'bg-red-50 border-red-200 text-red-600 rounded-2xl' :
                                        template === 'aurora' ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white/80' :
                                        template === 'clay' ? 'bg-[#fef2f2] border-red-200 text-red-700 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]' :
                                        template === 'spatial' ? 'bg-red-500/20 backdrop-blur-3xl border-red-500/30 text-white rounded-3xl' :
                                        template === 'neo' ? 'bg-red-400 border-4 border-black text-black font-black shadow-[8px_8px_0_#000]' :
                                        template === 'swiss' ? 'bg-black text-white border-none' :
                                        template === 'fluid' ? 'bg-white/60 backdrop-blur-lg border-white text-black' :
                                        template === 'dark_minimal' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' :
                                        template === 'synthwave' ? 'bg-transparent border-2 border-pink-500 text-pink-400 font-mono shadow-[0_0_10px_#ff007f]' :`
);

// 10. Achievements container
injectTernaryStr(
    "'bg-white/5 border-white/10'",
    `template === 'glass3d' ? 'bg-white/5 backdrop-blur-md border-white/10 shadow-lg' :
                                                template === 'bento' ? 'bg-slate-50 border-slate-100 rounded-2xl' :
                                                template === 'aurora' ? 'bg-white/5 backdrop-blur-xl border-white/10' :
                                                template === 'clay' ? 'bg-[#fafafa] border-transparent rounded-[20px] shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]' :
                                                template === 'spatial' ? 'bg-white/5 backdrop-blur-2xl border-white/10 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' :
                                                template === 'neo' ? 'bg-white border-4 border-black rounded-none shadow-[6px_6px_0_#000]' :
                                                template === 'swiss' ? 'bg-black border-none rounded-none' :
                                                template === 'fluid' ? 'bg-white/30 backdrop-blur-sm border-white/40' :
                                                template === 'dark_minimal' ? 'bg-black border border-zinc-800 rounded-none' :
                                                template === 'synthwave' ? 'bg-[#0f0c29] border-2 border-cyan-500 shadow-[0_0_10px_#00ffff]' :`
);

// 11. Achievements value
injectTernaryStr(
    "'text-white'",
    `template === 'glass3d' ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400' :
                                                    template === 'bento' ? 'text-slate-900' :
                                                    template === 'aurora' ? 'text-white' :
                                                    template === 'clay' ? 'text-slate-800' :
                                                    template === 'spatial' ? 'text-white' :
                                                    template === 'neo' ? 'text-black' :
                                                    template === 'swiss' ? 'text-white' :
                                                    template === 'fluid' ? 'text-black' :
                                                    template === 'dark_minimal' ? 'text-white' :
                                                    template === 'synthwave' ? 'text-cyan-400 drop-shadow-[0_0_5px_#00ffff]' :`
);

// 12. DNA Stats
injectTernaryStr(
    "'bg-white/5 border-white/10 text-zinc-400'",
    `template === 'glass3d' ? 'bg-white/5 backdrop-blur-md border-white/10 text-cyan-200' :
                                                template === 'bento' ? 'bg-white border-slate-200 text-slate-700 shadow-sm' :
                                                template === 'aurora' ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' :
                                                template === 'clay' ? 'bg-[#fafafa] border-transparent text-slate-700 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]' :
                                                template === 'spatial' ? 'bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-lg' :
                                                template === 'neo' ? 'bg-white border-2 border-black text-black shadow-[4px_4px_0_#000] rounded-none font-bold' :
                                                template === 'swiss' ? 'bg-white text-black rounded-none border-none' :
                                                template === 'fluid' ? 'bg-white/50 backdrop-blur-md border-white/50 text-black' :
                                                template === 'dark_minimal' ? 'bg-black border border-zinc-800 text-zinc-300 rounded-none' :
                                                template === 'synthwave' ? 'bg-black border border-pink-500 text-pink-400 shadow-[0_0_5px_#ff007f]' :`
);

// 13. Pills / Tags
injectTernaryStr(
    "'text-primary bg-primary/10 border-primary/20 hover:border-primary/50'",
    `template === 'glass3d' ? 'bg-white/5 backdrop-blur-md border-white/20 text-cyan-300 hover:bg-white/10' :
                                            template === 'bento' ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl' :
                                            template === 'aurora' ? 'bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20' :
                                            template === 'clay' ? 'bg-[#fafafa] border-transparent text-slate-700 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff,inset_2px_2px_4px_rgba(255,255,255,0.5)] rounded-2xl hover:scale-95' :
                                            template === 'spatial' ? 'bg-black/20 backdrop-blur-2xl border-white/10 text-white shadow-inner rounded-2xl' :
                                            template === 'neo' ? 'bg-white border-2 border-black text-black font-bold shadow-[2px_2px_0_#000] rounded-none hover:translate-x-1 hover:translate-y-1 hover:shadow-none' :
                                            template === 'swiss' ? 'bg-black text-white border-none rounded-none' :
                                            template === 'fluid' ? 'bg-white/40 backdrop-blur-sm border-white/50 text-black' :
                                            template === 'dark_minimal' ? 'bg-black border border-zinc-800 text-zinc-400 rounded-none hover:text-white' :
                                            template === 'synthwave' ? 'bg-transparent border border-cyan-400 text-cyan-400 shadow-[0_0_5px_#00ffff] rounded-none hover:bg-cyan-400/10' :`
);

// 14. Projects Container
injectTernaryStr(
    "'bg-white/2 border-white/10 rounded-2xl'",
    `template === 'glass3d' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-3xl' :
                                                    template === 'bento' ? 'bg-white border-slate-100 shadow-sm rounded-3xl' :
                                                    template === 'aurora' ? 'bg-white/5 backdrop-blur-2xl border-white/10 rounded-[30px]' :
                                                    template === 'clay' ? 'bg-[#fafafa] border-transparent rounded-[32px] shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]' :
                                                    template === 'spatial' ? 'bg-white/5 backdrop-blur-3xl border-white/10 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]' :
                                                    template === 'neo' ? 'bg-white border-4 border-black rounded-none shadow-[8px_8px_0_#000]' :
                                                    template === 'swiss' ? 'bg-black border-none rounded-none text-white' :
                                                    template === 'fluid' ? 'bg-white/30 backdrop-blur-md border-white/40 rounded-3xl' :
                                                    template === 'dark_minimal' ? 'bg-black border border-zinc-800 rounded-none' :
                                                    template === 'synthwave' ? 'bg-black/80 border-2 border-pink-500 shadow-[0_0_15px_#ff007f] rounded-none' :`
);

// 15. Projects Outer Grid
injectTernaryStr(
    "'flex flex-col gap-12'",
    `template === 'bento' ? 'grid md:grid-cols-2 gap-6' :
                                  template === 'glass3d' ? 'grid md:grid-cols-2 gap-8' :
                                  template === 'spatial' ? 'grid md:grid-cols-2 gap-8' :`
);

fs.writeFileSync('src/app/portfolio/[username]/page.tsx', publicPage);
console.log('Updated public page');

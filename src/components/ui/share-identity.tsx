import { toast } from "react-hot-toast";
import { Twitter } from "lucide-react";

interface ShareIdentityProps {
    username: string;
    template: string;
}

export function ShareIdentity({ username, template }: ShareIdentityProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    return (
        <section className="pt-24 border-t border-white/5">
            <div className={`p-12 rounded-[2.5rem] relative overflow-hidden transition-all ${
                template === 'neon' ? 'bg-primary/5 border border-primary/20' : 
                template === 'hacker' ? 'bg-emerald-500/5 border border-emerald-500/20' :
                template === 'blueprint' ? 'bg-blue-500/5 border border-blue-500/20' :
                template === 'minimalist' ? 'bg-zinc-100 border border-zinc-200' :
                'bg-white/5 border border-white/10'
            }`}>
                <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
                    <h3 className={`text-3xl font-black uppercase tracking-tighter italic ${
                        template === 'hacker' ? 'text-emerald-500' : 
                        template === 'blueprint' ? 'text-blue-400' : 
                        template === 'minimalist' ? 'text-zinc-900' : 'text-white'
                    }`}>
                        Share Your Identity
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                        template === 'minimalist' ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                        Your developer DNA is unique. Let the world see your AI-processed architecture and career archetypes.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button 
                            onClick={handleCopy}
                            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${
                                template === 'hacker' ? 'bg-emerald-500 text-black' : 
                                template === 'blueprint' ? 'bg-blue-500 text-white' : 
                                template === 'minimalist' ? 'bg-zinc-900 text-white' : 'bg-white text-black'
                            }`}
                        >
                            Copy Portfolio Link
                        </button>
                        <div className="flex gap-4">
                            <a 
                                href={`https://twitter.com/intent/tweet?text=Check out my AI-generated developer portfolio on DevRoast!&url=${encodeURIComponent('https://devroast.ai/portfolio/' + username)}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                                    template === 'minimalist' ? 'border-zinc-200 hover:bg-zinc-50' : 'border-white/10 hover:bg-white/5'
                                }`}
                            >
                                <Twitter className={`w-5 h-5 ${template === 'minimalist' ? 'text-zinc-900' : 'text-white'}`} />
                            </a>
                            <a 
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://devroast.ai/portfolio/' + username)}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                                    template === 'minimalist' ? 'border-zinc-200 hover:bg-zinc-50' : 'border-white/10 hover:bg-white/5'
                                }`}
                            >
                                <div className={`font-bold text-lg ${template === 'minimalist' ? 'text-zinc-900' : 'text-white'}`}>In</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`absolute top-0 left-0 w-full h-1 opacity-20 ${
                    template === 'hacker' ? 'bg-emerald-500' : 
                    template === 'blueprint' ? 'bg-blue-500' : 'bg-primary'
                }`} />
            </div>
        </section>
    );
}

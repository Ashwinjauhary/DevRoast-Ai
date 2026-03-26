/**
 * Hybrid AI System: Grok -> Groq -> SambaNova (Key Cycling)
 */
export async function getSambaNovaResponse(prompt: string, attempt: number = 0): Promise<string> {
    const groqKey = process.env.GROQ_API_KEY;

    // --- Phase 1: Groq (Primary) ---
    if (attempt === 0 && groqKey) {
        console.log(`[AI-FIXER] Attempting Groq Primary...`);
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${groqKey}`, 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "Expert developer specialized in high-performance engineering." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.2,
                    max_tokens: 4000,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    console.log("[AI-FIXER] Groq success!");
                    return content;
                }
            }
            console.warn(`[AI-FIXER] Groq failed (${response.status}). Falling back to SambaNova...`);
        } catch {
            console.warn(`[AI-FIXER] Groq error. Falling back...`);
        }
    }

    // --- Phase 2: SambaNova Cycling ---
    const keys = (process.env.SAMBANOVA_API_KEYS || process.env.SAMBANOVA_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

    if (keys.length === 0) throw new Error("No API keys found.");
    if (attempt >= keys.length) throw new Error("All AI keys exhausted.");

    const currentKey = keys[attempt];
    console.log(`[AI-FIXER] SambaNova Attempt ${attempt + 1}/${keys.length}...`);

    try {
        const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${currentKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "Meta-Llama-3.3-70B-Instruct",
                messages: [{ role: "system", content: "Expert dev." }, { role: "user", content: prompt }],
                max_tokens: 4000,
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            console.warn(`[AI-FIXER] SambaNova Key ${attempt + 1} failed (${response.status})`);
            await new Promise(r => setTimeout(r, 500));
            return getSambaNovaResponse(prompt, attempt + 1);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";

    } catch {
        return getSambaNovaResponse(prompt, attempt + 1);
    }
}
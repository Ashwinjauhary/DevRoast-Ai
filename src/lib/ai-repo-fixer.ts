const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

/**
 * Get all available Groq API keys from environment
 */
function getGroqKeys(): string[] {
    return (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);
}

/**
 * Groq-Only AI Text Response with multi-key rotation.
 * Used by dependency-auditor, job-compatibility, and other non-JSON tasks.
 */
export async function getAIResponse(prompt: string, attempt: number = 0): Promise<string> {
    const keys = getGroqKeys();

    if (keys.length === 0) throw new Error("No GROQ_API_KEYS configured.");
    if (attempt >= keys.length) throw new Error("All Groq keys exhausted.");

    const key = keys[attempt];

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
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
            if (content) return content;
        }

        console.warn(`[AI-FIXER] Key ${attempt + 1}/${keys.length} failed (${response.status}). Rotating...`);
        return getAIResponse(prompt, attempt + 1);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.warn(`[AI-FIXER] Key ${attempt + 1} error: ${msg}. Rotating...`);
        return getAIResponse(prompt, attempt + 1);
    }
}
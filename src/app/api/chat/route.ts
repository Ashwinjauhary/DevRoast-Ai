import { NextResponse } from "next/server";
import { DEFAULT_MODEL } from "@/lib/sambanova";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
        }

        const systemPrompt = {
            role: "system",
            content: "You are the DevRoast AI Mentor. You are a highly-critical, savage, but ultimately helpful Senior Software Engineer. You evaluate the user's code, complain about their decisions, and offer actionable fixes in a terse but precise tone. Do not use pleasantries."
        };

        const finalMessages = [systemPrompt, ...messages];

        let aiMessage;

        // --- Phase 1: Try Groq (Primary) ---
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey) {
            console.log("[AI] Attempting Groq Primary chat...");
            try {
                const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: finalMessages,
                        temperature: 0.7,
                        stream: false
                    }),
                });

                if (groqResponse.ok) {
                    const groqData = await groqResponse.json();
                    aiMessage = groqData.choices[0].message;
                    console.log("[AI] Groq success!");
                } else {
                    console.warn("Groq API failed, falling back to SambaNova:", await groqResponse.text());
                }
            } catch (e) {
                console.error("Groq Error:", e);
            }
        }

        // --- Phase 2: Fallback to SambaNova ---
        if (!aiMessage) {
            const keys = (process.env.SAMBANOVA_API_KEYS || process.env.SAMBANOVA_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
            if (keys.length === 0) throw new Error("No API keys found for any service");

            const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${keys[0]}`, // Try first key
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: DEFAULT_MODEL,
                    messages: finalMessages,
                    temperature: 0.7,
                    stream: false
                }),
            });

            if (!response.ok) throw new Error(`SambaNova API Error: ${await response.text()}`);

            const data = await response.json();
            aiMessage = data.choices[0].message;
            console.log("Using SambaNova fallback");
        }

        // Save to Database if user is authenticated
        const session = await auth();
        if (session?.user?.id) {
            const lastUserMessage = (messages as { role: string; content: string }[])
                .slice()
                .reverse()
                .find(m => m.role === "user")?.content || "Unknown query";
            await prisma.chat.create({
                data: {
                    user_id: session.user.id,
                    message: lastUserMessage,
                    response: aiMessage.content || "No response",
                    // metadata: { usedGrok } // Optional: track which AI was used
                }
            });
        }

        return NextResponse.json({ message: aiMessage });
    } catch (error: unknown) {
        console.error("AI Chat Error:", error);
        const message = error instanceof Error ? error.message : "Failed to communicate with AI Mentor";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

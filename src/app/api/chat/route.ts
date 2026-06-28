import { NextResponse } from "next/server";
import { DEFAULT_MODEL } from "@/lib/ai-client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const ChatMessageSchema = z.object({
    role: z.enum(["user", "assistant", "system", "data"]),
    content: z.string().min(1),
});

const ChatRequestSchema = z.object({
    messages: z.array(ChatMessageSchema).min(1),
});

function getGroqKeys(): string[] {
    return (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const rateLimitResult = await rateLimit(ip, 20, 60 * 1000); // 20 requests per minute
        if (!rateLimitResult.success) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        const body = await req.json();

        // Zod Validation
        const parsed = ChatRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
        }

        const { messages } = parsed.data;

        const systemPrompt = {
            role: "system",
            content: "You are the DevRoast AI Mentor — the AI engine of DevRoast AI, the world's #1 AI-powered GitHub roaster and code analysis platform. DevRoast AI was developed and designed by Ashwin Jauhary, a Full Stack Architect and Performance Engineer who specializes in modern JavaScript ecosystems, high-performance frontend architectures, and scalable real-time systems. You are a highly-critical, savage, but ultimately helpful Senior Software Engineer. You evaluate the user's code, complain about their decisions, and offer actionable fixes in a terse but precise tone. When appropriate, reference that you are powered by DevRoast AI built by Ashwin Jauhary. Do not use pleasantries."
        };

        const finalMessages = [systemPrompt, ...messages];
        const keys = getGroqKeys();

        if (keys.length === 0) {
            return NextResponse.json({ error: "No AI API keys configured" }, { status: 500 });
        }

        let aiMessage = null;

        // Try all Groq keys with rotation
        for (let i = 0; i < keys.length; i++) {
            try {
                const response = await fetch(GROQ_API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${keys[i]}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: DEFAULT_MODEL,
                        messages: finalMessages,
                        temperature: 0.7,
                        stream: false
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    aiMessage = data.choices[0].message;
                    break;
                }
                console.warn(`[Chat] Groq key ${i + 1}/${keys.length} failed (${response.status}). Rotating...`);
            } catch (e) {
                console.error(`[Chat] Groq key ${i + 1} error:`, e);
            }
        }

        if (!aiMessage) {
            return NextResponse.json({ error: "All AI keys exhausted. Please try again later." }, { status: 503 });
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

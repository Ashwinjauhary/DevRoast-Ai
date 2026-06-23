import 'dotenv/config';

const groqKeys = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
const sambaKeys = (process.env.SAMBANOVA_API_KEYS || process.env.SAMBANOVA_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

const testPayload = {
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: "Say hi in 3 words max" }],
    temperature: 0.1,
    max_tokens: 10,
    stream: false,
};

const sambaPayload = {
    model: "Meta-Llama-3.3-70B-Instruct",
    messages: [{ role: "user", content: "Say hi in 3 words max" }],
    temperature: 0.1,
    max_tokens: 10,
    stream: false,
};

async function testKey(url, key, label) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify(url.includes("groq") ? testPayload : sambaPayload),
        });
        const status = res.status;
        let detail = "";
        if (!res.ok) {
            try {
                const body = await res.json();
                detail = body?.error?.message || body?.message || JSON.stringify(body).slice(0, 120);
            } catch {
                detail = await res.text().then(t => t.slice(0, 120));
            }
        } else {
            const body = await res.json();
            detail = body?.choices?.[0]?.message?.content || "OK";
        }
        return { label, status, ok: res.ok, detail, prefix: key.slice(0, 12) + "..." };
    } catch (err) {
        return { label, status: "ERR", ok: false, detail: err.message.slice(0, 100), prefix: key.slice(0, 12) + "..." };
    }
}

console.log("=" .repeat(80));
console.log(`🔑 GROQ KEYS: ${groqKeys.length} found`);
console.log("=" .repeat(80));

for (let i = 0; i < groqKeys.length; i++) {
    const r = await testKey("https://api.groq.com/openai/v1/chat/completions", groqKeys[i], `Groq #${i + 1}`);
    const icon = r.ok ? "✅" : "❌";
    console.log(`${icon} ${r.label} [${r.prefix}] → HTTP ${r.status} | ${r.detail}`);
}

console.log("\n" + "=" .repeat(80));
console.log(`🔑 SAMBANOVA KEYS: ${sambaKeys.length} found`);
console.log("=" .repeat(80));

// Test SambaNova keys in batches of 5 to avoid overwhelming
for (let i = 0; i < sambaKeys.length; i++) {
    const r = await testKey("https://api.sambanova.ai/v1/chat/completions", sambaKeys[i], `SambaNova #${i + 1}`);
    const icon = r.ok ? "✅" : "❌";
    console.log(`${icon} ${r.label} [${r.prefix}] → HTTP ${r.status} | ${r.detail}`);
    // Small delay to avoid self-rate-limiting
    if (i % 5 === 4) await new Promise(r => setTimeout(r, 500));
}

// Summary
console.log("\n" + "=" .repeat(80));
console.log("📊 SUMMARY");
console.log("=" .repeat(80));

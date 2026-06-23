import fs from 'fs'; 
const env = fs.readFileSync('.env', 'utf8'); 
const keysMatch = env.match(/GROQ_API_KEYS="(.+)"/); 
if (!keysMatch) { console.log('No keys found'); process.exit(1); } 
const keys = keysMatch[1].split(','); 
console.log('Found ' + keys.length + ' keys. Testing...'); 
async function test() { 
    let ok = 0; let ratelimit = 0; let invalid = 0; 
    for(let i=0; i<keys.length; i++) { 
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', { 
            method: 'POST', 
            headers: { 'Authorization': 'Bearer ' + keys[i], 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{role: 'user', content: 'test'}], max_tokens: 5 }) 
        }); 
        if(res.ok) ok++; else if(res.status === 429) ratelimit++; else invalid++; 
    } 
    console.log('Results: ' + ok + ' OK, ' + ratelimit + ' Rate Limited, ' + invalid + ' Invalid'); 
} 
test();

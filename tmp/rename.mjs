import fs from 'fs/promises';
import path from 'path';

async function processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
            let content = await fs.readFile(fullPath, 'utf8');
            let modified = false;

            if (content.includes('@/lib/sambanova')) {
                content = content.replace(/@\/lib\/sambanova/g, '@/lib/ai-client');
                modified = true;
            }
            if (content.includes('getSambaNovaResponse')) {
                content = content.replace(/getSambaNovaResponse/g, 'getAIResponse');
                modified = true;
            }
            if (content.includes('SambaNova AI Generation')) {
                content = content.replace(/SambaNova AI Generation/g, 'AI Generation');
                modified = true;
            }
            if (content.includes('SambaNova Prompt')) {
                content = content.replace(/SambaNova Prompt/g, 'AI Prompt');
                modified = true;
            }
            if (content.includes('SambaNova decides the winner')) {
                content = content.replace(/SambaNova decides the winner/g, 'AI decides the winner');
                modified = true;
            }

            if (modified) {
                await fs.writeFile(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

async function main() {
    await processDirectory(path.join(process.cwd(), 'src', 'app'));
    await processDirectory(path.join(process.cwd(), 'src', 'lib'));
    console.log('Done!');
}

main().catch(console.error);

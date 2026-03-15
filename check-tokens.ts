import { PrismaClient } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            accounts: true
        }
    });

    let output = "DB Check Results:\n";
    users.forEach(u => {
        output += `User: ${u.email} (${u.id})\n`;
        output += `  GitHub Username: ${u.github_username}\n`;
        u.accounts.forEach(acc => {
            output += `  Account: ${acc.provider}\n`;
            output += `    Token Exists: ${!!acc.access_token}\n`;
            output += `    Token Length: ${acc.access_token?.length || 0}\n`;
            if (acc.access_token) {
                output += `    Token Start: ${acc.access_token.substring(0, 8)}...\n`;
            }
        });
    });
    fs.writeFileSync("./token-debug.txt", output);
    console.log("Results written to token-debug.txt");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

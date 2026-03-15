import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const account = await prisma.account.findFirst({
        where: {
            provider: "github"
        }
    });

    if (!account || !account.access_token) {
        console.error("No GitHub account or token found in DB.");
        return;
    }

    console.log(`Testing token: ${account.access_token.substring(0, 8)}...`);

    const res = await fetch("https://api.github.com/user", {
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": `Bearer ${account.access_token}`,
            "User-Agent": "DevRoast-AI"
        }
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (res.ok) {
        console.log(`Successfully authenticated as: ${data.login}`);
    } else {
        console.log("Error response:", data);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

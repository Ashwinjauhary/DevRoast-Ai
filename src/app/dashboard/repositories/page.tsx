import { fetchRepositories } from "./actions";
import { RepositoryManager } from "./repository-manager";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Repository Manager | DevRoast AI",
    description: "Manage your GitHub repositories directly from the dashboard.",
};

export default async function RepositoriesPage() {
    const session = await auth();

    if (!session) {
        redirect("/auth/signin");
    }

    const { success, data, error } = await fetchRepositories();

    if (!success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 font-bold mb-4">
                    !
                </div>
                <h2 className="text-2xl font-black text-white">Connection Failed</h2>
                <p className="text-zinc-400 font-medium max-w-md">
                    We couldn&apos;t fetch your GitHub repositories.
                    <br /><br />
                    <span className="text-sm">Error: {error}</span>
                </p>
                <p className="text-sm text-zinc-500 bg-white/2 p-4 rounded-xl border border-white/5 mt-4 text-left">
                    <strong>Tip:</strong> You may need to sign out and sign back in to accept the new <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">delete_repo</code> permission scope.
                </p>
            </div>
        );
    }

    return <RepositoryManager initialRepos={data || []} />;
}

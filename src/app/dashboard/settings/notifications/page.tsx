import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getNotificationPrefs } from "./actions";
import NotificationsClient from "./notifications-client";

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const prefs = await getNotificationPrefs();
    return <NotificationsClient prefs={prefs} />;
}

"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/api/auth/logout?token=" + session?.idToken });
    };

    if (session) {
        return (
            <div>
                <span>{session.user?.name || session.user?.email}</span>
                <button onClick={handleLogout}>Sign out</button>
            </div>
        );
    }

    return <button onClick={() => signIn("keycloak")}>Sign in</button>;
}

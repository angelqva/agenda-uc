"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
    const { data: session, status } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/api/auth/logout?token=" + session?.idToken });
    };

    if (status === "loading") {
        return (
            <Button 
                disabled 
                aria-label="Cargando estado de sesión"
            >
                Cargando...
            </Button>
        );
    }

    if (session) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    Hola, {session.user?.name || session.user?.email}
                </span>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                >
                    Cerrar sesión
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={() => signIn("keycloak")}
            aria-label="Iniciar sesión con Keycloak"
        >
            Iniciar sesión
        </Button>
    );
}

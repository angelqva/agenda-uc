"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { I18nProvider } from "@react-aria/i18n";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'sonner';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const router = useRouter();

    return (
        <I18nProvider locale="es-ES">
            <HeroUIProvider navigate={router.push}>
                <NextThemesProvider {...themeProps}>
                    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
                        {children}                    
                    </SessionProvider>
                    <Toaster richColors position="top-right" />
                </NextThemesProvider>
            </HeroUIProvider>
        </I18nProvider>
    );
}

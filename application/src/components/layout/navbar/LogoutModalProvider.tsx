"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signOut } from "next-auth/react";

interface LogoutModalContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isLoggingOut: boolean;
    handleLogout: () => Promise<void>;
    openModal: () => void;
    closeModal: () => void;
}

const LogoutModalContext = createContext<LogoutModalContextType | undefined>(undefined);

export function LogoutModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Open modal with Ctrl+Shift+L
            if (event.ctrlKey && event.shiftKey && event.key === 'L') {
                event.preventDefault();
                setIsOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoggingOut(false);
            setIsOpen(false);
        }
    };

    const value: LogoutModalContextType = {
        isOpen,
        setIsOpen,
        isLoggingOut,
        handleLogout,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
    };

    return (
        <LogoutModalContext.Provider value={value}>
            {children}
        </LogoutModalContext.Provider>
    );
}

export function useLogoutModalContext() {
    const context = useContext(LogoutModalContext);
    if (context === undefined) {
        throw new Error('useLogoutModalContext must be used within a LogoutModalProvider');
    }
    return context;
}
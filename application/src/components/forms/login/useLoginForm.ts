"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm, type UseFormRegister, type FieldErrors, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import loginSchema, { type LoginFormValues } from '@/schemas/login.schema';
import type { ServiceResponse } from '@/types/common.types';

/**
 * Shape of the optional onSuccess callback provided to the hook.
 */
// The hook no longer accepts an onSuccess callback - it always redirects to /panel on success.

export interface UseLoginFormResult {
    register: UseFormRegister<LoginFormValues>;
    handleSubmit: (fn: SubmitHandler<LoginFormValues>) => (e?: any) => Promise<void>;
    errors: FieldErrors<LoginFormValues>;
    isSubmitting: boolean;
    rootError: string | null;
    clearRootError: () => void;
    onSubmit: SubmitHandler<LoginFormValues>;
}

/**
 * Helper to safely parse possible structured error payloads that NextAuth may return.
 */
function tryParseStructuredError(payload?: string) {
    if (!payload) return null;
    try {
        return JSON.parse(payload);
    } catch {
        // Sometimes NextAuth encodes structured JSON into a URL query param
        try {
            const decoded = decodeURIComponent(payload);
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    }
}

/**
 * Custom hook that encapsulates the login form logic: validation, submission and error mapping.
 * All user-facing messages are in Spanish.
 */
export function useLoginForm(): UseLoginFormResult {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, handleSubmit, setError, formState } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'all',
    });

    const [rootError, setRootError] = useState<string | null>(null);
    const prevValuesRef = useRef<LoginFormValues | null>(null);

    const clearRootError = useCallback(() => setRootError(null), []);

    const onSubmit: SubmitHandler<LoginFormValues> = useCallback(async (values) => {
        prevValuesRef.current = values;
        try {
            const result = await signIn('credentials', { ...values, redirect: false });

            // Success path
            if (result?.ok) {
                toast.success('Inicio de sesión exitoso');

                // Prefer a callbackUrl from current search params (useSearchParams) or from result.url
                let callbackUrl: string | null = null;
                try {
                    callbackUrl = searchParams?.get('callbackUrl') ?? null;
                } catch {
                    callbackUrl = null;
                }

                // If not found in current search params, try to extract from result.url
                if (!callbackUrl && result?.url) {
                    try {
                        const parsed = new URL(result.url, typeof window !== 'undefined' ? window.location.origin : undefined);
                        callbackUrl = parsed.searchParams.get('callbackUrl');
                    } catch {
                        // ignore
                    }
                }

                if (callbackUrl) {
                    // If it's an absolute URL, navigate via location.href to ensure full redirect
                    if (/^https?:\/\//i.test(callbackUrl)) {
                        if (typeof window !== 'undefined') window.location.href = callbackUrl;
                        else router.push('/panel');
                    } else {
                        router.push(callbackUrl);
                    }
                } else {
                    router.push('/panel');
                }

                return;
            }

            // Try to extract structured error either from result.error or result.url
            let parsed: ServiceResponse<any> | null = null;
            if (result?.error) parsed = tryParseStructuredError(result.error) as ServiceResponse<any> | null;
            if (!parsed && result?.url && result.url.includes('error=')) {
                try {
                    const url = new URL(result.url);
                    const encoded = url.searchParams.get('error') ?? undefined;
                    parsed = tryParseStructuredError(encoded) as ServiceResponse<any> | null;
                } catch {
                    parsed = null;
                }
            }

            if (parsed) {
                const response = parsed as ServiceResponse<any>;
                // Map field errors
                const errs = response.errors ?? null;
                if (errs) {
                    const fields = errs.fields ?? {};
                    const usernameMsgs = fields['username'];
                    const passwordMsgs = fields['password'];
                    if (usernameMsgs) setError('username', { type: 'server', message: Array.isArray(usernameMsgs) ? usernameMsgs.join(' ') : String(usernameMsgs) });
                    if (passwordMsgs) setError('password', { type: 'server', message: Array.isArray(passwordMsgs) ? passwordMsgs.join(' ') : String(passwordMsgs) });
                    if (errs.root) setRootError(String(errs.root));
                }
                // Toast instructions from server
                if (response.toast) {
                    const t = response.toast;
                    if (t.type === 'error') toast.error(t.title || 'Error', { description: t.description || undefined });
                    else toast.success(t.title || 'Listo', { description: t.description || undefined });
                }
                return;
            }

            // Fallback messages
            if (result?.error) {
                toast.error('Error', { description: String(result.error) || undefined });
                return;
            }

            toast.error('Error', { description: 'No se pudo iniciar sesión' });
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Error en el servidor:`, { description: message || undefined });
        }
    }, [router, setError, searchParams]);

    return useMemo(() => ({
        register,
        handleSubmit,
        errors: formState.errors,
        isSubmitting: formState.isSubmitting,
        rootError,
        clearRootError,
        onSubmit,
    }), [register, handleSubmit, formState, rootError, clearRootError, onSubmit]);
}

export default useLoginForm;

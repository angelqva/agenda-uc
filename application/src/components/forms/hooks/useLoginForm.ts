"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm, type UseFormRegister, type FieldErrors, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import loginSchema, { type LoginFormValues } from '@/schemas/login.schema';

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
      let parsed: any = null;
      if (result?.error) parsed = tryParseStructuredError(result.error);
      if (!parsed && result?.url && result.url.includes('error=')) {
        try {
          const url = new URL(result.url);
          const encoded = url.searchParams.get('error') ?? undefined;
          parsed = tryParseStructuredError(encoded);
        } catch {
          parsed = null;
        }
      }

      if (parsed) {
        // Map field errors
        if (parsed.errors) {
          const errs = parsed.errors as Record<string, string>;
          if (errs.username) setError('username', { type: 'server', message: String(errs.username) });
          if (errs.password) setError('password', { type: 'server', message: String(errs.password) });
          if (errs.root) setRootError(String(errs.root));
        }
        // Toast instructions from server
        if (parsed.toast) {
          const t = parsed.toast as { type?: string; title?: string; description?: string };
          if (t.type === 'error') toast.error(t.description || t.title || 'Error');
          else toast.success(t.description || t.title || 'Listo');
        }
        return;
      }

      // Fallback messages
      if (result?.error) {
        toast.error(String(result.error) || 'No se pudo iniciar sesión');
        return;
      }

      toast.error('No se pudo iniciar sesión');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Error en el servidor: ${message}`);
    }
  }, [router, setError]);

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

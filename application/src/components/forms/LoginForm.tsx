'use client';

import { loginSchema, type LoginFormInputs } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, Input, Alert } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState, useRef } from 'react';

/**
 * @component LoginForm
 * @description Componente de cliente que renderiza y gestiona el formulario de inicio de sesión.
 * Incluye validación, manejo de estado de envío y notificaciones.
 * Utiliza componentes de la librería @heroui/react.
 */
export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [rootError, setRootError] = useState<string | null>(null);
  const watchedUsername = watch('username');
  const watchedPassword = watch('password');
    // Keep a snapshot of field values when rootError was set so we only clear
    // the alert when the user changes the fields after the error appeared.
    const prevUsernameRef = useRef<string | undefined>(undefined);
    const prevPasswordRef = useRef<string | undefined>(undefined);

    const showRootError = (msg: string) => {
      console.debug('setting rootError', msg);
      prevUsernameRef.current = watchedUsername;
      prevPasswordRef.current = watchedPassword;
      setRootError(msg);
    };

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Primero valida contra el servicio LDAP (API interna). Si LDAP valida, continua
   * con NextAuth para establecer la sesión. Si falla, mapea errores al formulario.
   */
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Directly use NextAuth signIn which will call our authorize and may return
      // a structured JSON error string in result.error
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

  // Do not clear root errors here — keep alert visible until user edits fields or closes it

      if (result?.ok) {
        toast.success('Inicio de sesión exitoso', {
          description: 'Serás redirigido al panel principal.',
        });
        router.push('/');
        return;
      }

      // NextAuth sometimes returns structured errors encoded into a redirect URL
      // e.g. result.url === '.../api/auth/error?error=%7B...%7D'
  console.debug('signIn result', result);
      if (result?.url && result.url.includes('error=')) {
        try {
          const url = new URL(result.url);
          const encoded = url.searchParams.get('error');
            if (encoded) {
            const decoded = decodeURIComponent(encoded);
            const parsed = JSON.parse(decoded);
            console.debug('parsed error from url', parsed);
            const errs = parsed.errors;
            if (errs) {
              if (errs.username) setError('username', { type: 'server', message: errs.username });
              if (errs.password) setError('password', { type: 'server', message: errs.password });
              if (errs.root) showRootError(errs.root);
            }
            if (parsed.toast) {
              if (parsed.toast.type === 'error') toast.error(parsed.toast.description || parsed.toast.title);
              else if (parsed.toast.type === 'success') toast.success(parsed.toast.description || parsed.toast.title);
            }
            return;
          }
          } catch (e) {
          console.debug('error parsing url error param', e);
        }
      }

      // If there's an error string, try parsing it directly
      if (result?.error) {
        try {
          const parsed = JSON.parse(result.error);
          console.debug('parsed error from result.error', parsed);
          const errs = parsed.errors;
            if (errs) {
              if (errs.username) setError('username', { type: 'server', message: errs.username });
              if (errs.password) setError('password', { type: 'server', message: errs.password });
              if (errs.root) showRootError(errs.root);
            }
          if (parsed.toast) {
            if (parsed.toast.type === 'error') toast.error(parsed.toast.description || parsed.toast.title);
            else if (parsed.toast.type === 'success') toast.success(parsed.toast.description || parsed.toast.title);
          }
          return;
        } catch (e) {
          // Not JSON - fallback to generic message
          toast.error(result.error || 'No se pudo iniciar sesión.');
          return;
        }
      }

      toast.error('No se pudo iniciar sesión.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      toast.error('Error en el servidor: ' + message);
    }
  };
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // Clear root error when user edits username/password
  useEffect(() => {
    if (rootError) {
      const usernameChanged = prevUsernameRef.current !== undefined && prevUsernameRef.current !== watchedUsername;
      const passwordChanged = prevPasswordRef.current !== undefined && prevPasswordRef.current !== watchedPassword;
      if (usernameChanged || passwordChanged) {
        console.debug('clearing rootError because field changed', { usernameChanged, passwordChanged });
        setRootError(null);
        prevUsernameRef.current = undefined;
        prevPasswordRef.current = undefined;
      }
    }
  }, [watchedUsername, watchedPassword, rootError]);
  return (
    <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
      <Card>
        <CardBody>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)} noValidate>
            {rootError && (
              <Alert color="danger" className="mb-4 relative" role="alert" aria-live="assertive">
                <span>{rootError}</span>
                <Button className='absolute right-1 top-3 font-bold' isIconOnly color="danger" variant='light'  onPress={() => setRootError(null)} aria-label="Cerrar alerta">
                  ✕
                </Button>
              </Alert>
            )}
            <Input
              label="Usuario"
              type="text"
              placeholder="nombre.apellido"
              autoComplete="username"
              variant="bordered"
              color={errors.username ? 'danger' : 'default'}
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message}
              {...register('username')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              variant="bordered"
              color={errors.password ? 'danger' : 'default'}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register('password')}
            />
            <div className="form-control mt-6">
              <Button type="submit" color="primary" isLoading={isSubmitting}>
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

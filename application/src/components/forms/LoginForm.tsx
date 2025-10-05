'use client';

import { loginSchema, type LoginFormInputs } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * @param data - Los datos del formulario validados.
   */
  const onSubmit = async (data: LoginFormInputs) => {
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (result?.ok) {
      toast.success('Inicio de sesión exitoso', {
        description: 'Serás redirigido al panel principal.',
      });
      router.push('/');
    } else {
      toast.error('Error de autenticación', {
        description: result?.error || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Usuario"
          type="text"
          placeholder="nombre.apellido"
          autoComplete="username"
          variant="bordered"
          color={errors.username ? 'danger' : 'default'}
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
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        <div className="form-control mt-6">
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </div>
      </form>
    </div>
  );
}

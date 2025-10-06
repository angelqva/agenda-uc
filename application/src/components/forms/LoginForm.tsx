"use client";

import React from 'react';
import { Input, Button, Card, CardBody, Alert } from '@heroui/react';
import useLoginForm from './hooks/useLoginForm';

/**
 * Props for LoginForm component
 */
/**
 * LoginForm
 * Presentational component: delegates validation and submit logic to `useLoginForm`.
 * All messages in Spanish.
 */
export function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting, rootError, clearRootError, onSubmit } = useLoginForm();

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="shadow-lg">
        <CardBody>
          <form role="form" aria-labelledby="login-form-title" className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 id="login-form-title" className="text-lg font-semibold">Iniciar sesión</h2>

            {rootError && (
              <Alert
                color="danger"
                variant="faded"
                role="alert"
                aria-live="assertive"
                className="mb-2"
                endContent={
                  <Button isIconOnly color="danger" variant="flat" onPress={clearRootError} aria-label="Cerrar alerta">
                    ✕
                  </Button>
                }
              >
                {rootError}
              </Alert>
            )}

            <Input
              label="Usuario"
              type="text"
              placeholder="nombre.apellido"
              autoComplete="username"
              variant="bordered"
              {...(register('username') as any)}
              isInvalid={!!errors.username}
              color={errors.username ? 'danger' : 'default'}
              errorMessage={errors.username?.message as unknown as string}
              aria-invalid={!!errors.username}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              variant="bordered"
              {...(register('password') as any)}
              isInvalid={!!errors.password}
              color={errors.password ? 'danger' : 'default'}
              errorMessage={errors.password?.message as unknown as string}
              aria-invalid={!!errors.password}
            />

            <div className="pt-2">
              <Button type="submit" color="primary" isLoading={isSubmitting} className="w-full">
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginForm;
 

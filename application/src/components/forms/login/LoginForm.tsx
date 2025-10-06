"use client";

import React from 'react';
import { Input, Button, Card, CardBody, Alert } from '@heroui/react';
import useLoginForm from './useLoginForm';
import { ShieldKey } from '../../icons/iconify';
import { InputPassword } from '../../ui/Inputs';

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
    <Card className="shadow-lg max-w-sm mx-auto bg-default-400/10 backdrop-blur-lg border-2 border-default-300">
      <CardBody className='p-4'>
        <form role="form" aria-labelledby="login-form-title" className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {rootError && (
            <Alert
              color="danger"
              variant="faded"
              role="alert"
              aria-live="assertive"
              className="mb-4"
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
            autoComplete="username"
            variant="bordered"            
            isInvalid={!!errors.username}
            color={errors.username ? 'danger' : 'default'}
            errorMessage={errors.username?.message as unknown as string}
            aria-invalid={!!errors.username}
            {...(register('username') as any)}
          />

          <InputPassword
            label="Contraseña"
            autoComplete="current-password"
            variant="bordered"            
            isInvalid={!!errors.password}
            color={errors.password ? 'danger' : 'default'}
            errorMessage={errors.password?.message as unknown as string}
            aria-invalid={!!errors.password}
            {...(register('password') as any)}
          />

          <div className="pt-2">
            <Button type="submit" color="primary" isLoading={isSubmitting} size='lg' className="w-full"
              startContent={!isSubmitting && <ShieldKey />}
            >
              {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default LoginForm;


import { z } from 'zod';

/**
 * Zod schema for the login form values.
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido').trim(),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default loginSchema;

import { z } from 'zod';

/**
 * @file Esquemas de validación para la autenticación.
 * @description Define los esquemas de Zod utilizados para validar los datos
 * en los formularios y DTOs relacionados con la autenticación.
 */

/**
 * Esquema para el formulario de inicio de sesión.
 *
 * - `username`: Requerido, mínimo 3 caracteres.
 * - `password`: Requerido, mínimo 6 caracteres.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'El nombre de usuario es obligatorio.' })
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es obligatoria.' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

/**
 * Infiere el tipo de datos del esquema de inicio de sesión para usarlo en el frontend.
 * @example type LoginFormInputs = z.infer<typeof loginSchema>;
 */
export type LoginFormInputs = z.infer<typeof loginSchema>;

import { z } from 'zod';

// DTO para login LDAP
export const LoginDtoSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(50, 'El username no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username contiene caracteres inválidos'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(200, 'La contraseña es demasiado larga'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

// DTO para respuesta de perfil
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  roles: z.array(z.string()),
  sede: z.object({
    id: z.string(),
    nombre: z.string(),
  }).nullable(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// DTO para payload JWT
export const JwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// Respuesta de login exitoso
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: UserProfileSchema.optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
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

// DTO para perfil de usuario
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  roles: z.array(z.string()),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// DTO para payload JWT (access token)
export const JwtPayloadSchema = z.object({
  sub: z.string(), // User ID
  email: z.string(),
  roles: z.array(z.string()),
  type: z.literal('access'),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// DTO para payload de refresh token
export const RefreshTokenPayloadSchema = z.object({
  sub: z.string(), // User ID
  type: z.literal('refresh'),
  tokenId: z.string(), // ID único del refresh token
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

// Respuesta de login exitoso
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: UserProfileSchema,
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Respuesta de refresh token
export const RefreshResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  accessToken: z.string(),
});

export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

// Respuesta genérica
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
/**
 * DTOs para servicios LDAP con validación Zod
 * Siguiendo las mejores prácticas definidas en copilot.json
 */

import { z } from 'zod';

/**
 * DTO para credenciales de autenticación LDAP
 */
export const LdapCredentialsDto = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido')
    .max(100, 'El nombre de usuario es demasiado largo')
    .regex(/^[a-zA-Z0-9._-]+$/, 'El nombre de usuario contiene caracteres inválidos'),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(200, 'La contraseña es demasiado larga')
});

export type LdapCredentialsDto = z.infer<typeof LdapCredentialsDto>;

/**
 * DTO para opciones de búsqueda de usuarios
 */
export const LdapSearchOptionsDto = z.object({
  searchTerm: z
    .string()
    .min(1, 'El término de búsqueda no puede estar vacío')
    .max(100, 'El término de búsqueda es demasiado largo')
    .optional(),
    
  filter: z
    .string()
    .max(500, 'El filtro LDAP es demasiado largo')
    .optional(),
    
  limit: z
    .number()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(1000, 'El límite no puede exceder 1000')
    .default(50)
    .optional(),
    
  attributes: z
    .array(z.string())
    .max(20, 'No se pueden solicitar más de 20 atributos')
    .optional()
});

export type LdapSearchOptionsDto = z.infer<typeof LdapSearchOptionsDto>;

/**
 * DTO para respuesta de autenticación
 */
export const LdapAuthResponseDto = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.object({
    id: z.string(),
    nombre: z.string(),
    correo: z.string().email('Formato de correo inválido'),
    dn: z.string(),
    metadata: z.object({
      username: z.string(),
      departamento: z.string().optional(),
      telefono: z.string().optional()
    }).optional()
  }).optional(),
  error: z.string().optional()
});

export type LdapAuthResponseDto = z.infer<typeof LdapAuthResponseDto>;

/**
 * DTO para respuesta de búsqueda de usuarios
 */
export const LdapSearchResponseDto = z.object({
  users: z.array(z.object({
    id: z.string(),
    nombre: z.string(),
    correo: z.string().email('Formato de correo inválido'),
    dn: z.string(),
    metadata: z.object({
      username: z.string(),
      departamento: z.string().optional(),
      telefono: z.string().optional()
    }).optional()
  })),
  total: z.number().int().min(0),
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional()
});

export type LdapSearchResponseDto = z.infer<typeof LdapSearchResponseDto>;

/**
 * DTO para configuración LDAP
 */
export const LdapConfigDto = z.object({
  url: z.string().url('URL LDAP inválida'),
  baseDN: z.string().min(1, 'Base DN es requerido'),
  bindDN: z.string().min(1, 'Bind DN es requerido'),
  bindPassword: z.string().min(1, 'Bind password es requerido'),
  userSearchFilter: z.string().min(1, 'Filtro de búsqueda es requerido'),
  userAttributes: z.array(z.string()).min(1, 'Al menos un atributo es requerido'),
  timeout: z.number().int().min(1000).max(30000).default(5000).optional()
});

export type LdapConfigDto = z.infer<typeof LdapConfigDto>;

/**
 * Helper para convertir errores de validación Zod en fieldErrors para el frontend
 */
export function zodErrorToFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  
  error.issues.forEach((err: z.ZodIssue) => {
    const field = err.path.join('.');
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(err.message);
  });
  
  return fieldErrors;
}
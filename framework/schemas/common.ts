import { z } from "zod";

/**
 * Esquemas comunes reutilizables para validación
 */

// ==========================================
// CAMPOS BÁSICOS
// ==========================================

export const emailSchema = z
  .string()
  .min(1, "Email es requerido")
  .email("Formato de email inválido")
  .max(254, "Email demasiado largo")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña es demasiado larga")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial");

export const confirmPasswordSchema = z
  .string()
  .min(1, "Confirmación de contraseña es requerida");

export const nombreSchema = z
  .string()
  .min(1, "Nombre es requerido")
  .max(100, "Nombre demasiado largo")
  .regex(/^[a-zA-ZÀ-ÿñÑ\s]+$/, "Solo se permiten letras y espacios")
  .trim();

export const apellidoSchema = z
  .string()
  .min(1, "Apellido es requerido")
  .max(100, "Apellido demasiado largo")
  .regex(/^[a-zA-ZÀ-ÿñÑ\s]+$/, "Solo se permiten letras y espacios")
  .trim();

export const telefonoSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Formato de teléfono inválido")
  .optional()
  .or(z.literal(""));

export const urlSchema = z
  .string()
  .url("URL inválida")
  .max(2048, "URL demasiado larga")
  .optional()
  .or(z.literal(""));

export const codigoSchema = z
  .string()
  .min(1, "Código es requerido")
  .max(20, "Código demasiado largo")
  .regex(/^[A-Z0-9_-]+$/, "Solo se permiten letras mayúsculas, números, guiones y guiones bajos")
  .trim();

// ==========================================
// CAMPOS DE IDENTIFICACIÓN
// ==========================================

export const idSchema = z
  .string()
  .min(1, "ID es requerido")
  .max(50, "ID demasiado largo");

export const cuidSchema = z
  .string()
  .regex(/^[a-z0-9]{25}$/, "Formato de CUID inválido");

// ==========================================
// CAMPOS DE FECHA Y HORA
// ==========================================

export const fechaSchema = z
  .string()
  .datetime("Formato de fecha inválido")
  .or(z.date());

export const fechaFuturaSchema = z
  .string()
  .datetime("Formato de fecha inválido")
  .or(z.date())
  .refine((date) => new Date(date) > new Date(), {
    message: "La fecha debe ser futura",
  });

export const fechaPasadaSchema = z
  .string()
  .datetime("Formato de fecha inválido")
  .or(z.date())
  .refine((date) => new Date(date) < new Date(), {
    message: "La fecha debe ser pasada",
  });

// ==========================================
// CAMPOS NUMÉRICOS
// ==========================================

export const capacidadSchema = z
  .number()
  .int("Debe ser un número entero")
  .min(1, "La capacidad debe ser mayor a 0")
  .max(10000, "La capacidad es demasiado alta");

export const cantidadSchema = z
  .number()
  .int("Debe ser un número entero")
  .min(1, "La cantidad debe ser mayor a 0")
  .max(1000, "La cantidad es demasiado alta");

export const participantesSchema = z
  .number()
  .int("Debe ser un número entero")
  .min(1, "Debe haber al menos 1 participante")
  .max(1000, "Demasiados participantes");

// ==========================================
// CAMPOS DE PAGINACIÓN
// ==========================================

export const pageSchema = z
  .number()
  .int("Página debe ser un número entero")
  .min(1, "La página debe ser mayor a 0")
  .default(1);

export const limitSchema = z
  .number()
  .int("Límite debe ser un número entero")
  .min(1, "El límite debe ser mayor a 0")
  .max(100, "El límite máximo es 100")
  .default(10);

export const searchSchema = z
  .string()
  .max(255, "Búsqueda demasiado larga")
  .optional()
  .or(z.literal(""));

// ==========================================
// CAMPOS DE TEXTO
// ==========================================

export const descripcionSchema = z
  .string()
  .max(1000, "Descripción demasiado larga")
  .optional()
  .or(z.literal(""));

export const biografiaSchema = z
  .string()
  .max(500, "Biografía demasiado larga")
  .optional()
  .or(z.literal(""));

export const notasSchema = z
  .string()
  .max(2000, "Notas demasiado largas")
  .optional()
  .or(z.literal(""));

export const tituloSchema = z
  .string()
  .min(1, "Título es requerido")
  .max(200, "Título demasiado largo")
  .trim();

// ==========================================
// CAMPOS BOOLEANOS
// ==========================================

export const activoSchema = z
  .boolean()
  .default(true);

export const leidaSchema = z
  .boolean()
  .default(false);

// ==========================================
// ESQUEMAS DE VALIDACIÓN DE CONTRASEÑAS
// ==========================================

export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ==========================================
// ESQUEMAS DE PAGINACIÓN
// ==========================================

export const paginationSchema = z.object({
  page: pageSchema,
  limit: limitSchema,
});

export const searchPaginationSchema = paginationSchema.extend({
  search: searchSchema,
});

// ==========================================
// ESQUEMAS DE FECHAS DE RANGO
// ==========================================

export const rangoFechasSchema = z
  .object({
    inicio: fechaSchema,
    fin: fechaSchema,
  })
  .refine((data) => new Date(data.inicio) < new Date(data.fin), {
    message: "La fecha de inicio debe ser anterior a la fecha de fin",
    path: ["fin"],
  });

export const rangoFechasFuturaSchema = z
  .object({
    inicio: fechaFuturaSchema,
    fin: fechaFuturaSchema,
  })
  .refine((data) => new Date(data.inicio) < new Date(data.fin), {
    message: "La fecha de inicio debe ser anterior a la fecha de fin",
    path: ["fin"],
  });
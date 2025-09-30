import { z } from "zod";
import { RolBase, RolSistema } from "@/types";
import {
  emailSchema,
  urlSchema,
  biografiaSchema,
  telefonoSchema,
  activoSchema,
  paginationSchema,
  searchSchema,
} from "./common";

/**
 * Esquemas de validación para el dominio Usuario
 */

// ==========================================
// ENUMS DE VALIDACIÓN
// ==========================================

export const rolBaseSchema = z.nativeEnum(RolBase, {
  errorMap: () => ({ message: "Rol base inválido" }),
});

export const rolSistemaSchema = z.nativeEnum(RolSistema, {
  errorMap: () => ({ message: "Rol de sistema inválido" }),
});

// ==========================================
// ESQUEMAS DE ENTRADA - USUARIOS
// ==========================================

export const createUsuarioSchema = z.object({
  email: emailSchema,
  imageUrl: urlSchema,
  biografia: biografiaSchema,
  telefono: telefonoSchema,
});

export const updateUsuarioSchema = z.object({
  imageUrl: urlSchema,
  biografia: biografiaSchema,
  telefono: telefonoSchema,
  activo: activoSchema,
}).partial();

export const upsertUsuarioSchema = createUsuarioSchema.extend({
  email: emailSchema, // Email es requerido en upsert
});

// ==========================================
// ESQUEMAS DE CONSULTA - USUARIOS
// ==========================================

export const findUsuarioByEmailSchema = z.object({
  email: emailSchema,
});

export const findUsuarioByIdSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
});

export const findUsuariosActivosSchema = paginationSchema.extend({
  email: searchSchema,
});

// ==========================================
// ESQUEMAS DE ROLES
// ==========================================

export const assignRoleSchema = z.object({
  email: emailSchema,
  rol: rolBaseSchema,
});

export const removeRoleSchema = z.object({
  email: emailSchema,
  rol: rolBaseSchema,
});

export const verifyRoleSchema = z.object({
  email: emailSchema,
  rol: rolSistemaSchema,
});

export const verifyBaseRoleSchema = z.object({
  email: emailSchema,
  rol: rolBaseSchema,
});

// ==========================================
// ESQUEMAS DE RESPUESTA
// ==========================================

export const rolesEfectivosResponseSchema = z.object({
  email: emailSchema,
  rolesBase: z.array(rolBaseSchema),
  rolesCalculados: z.array(rolSistemaSchema),
  rolesEfectivos: z.array(rolSistemaSchema),
  calculadoEn: z.date(),
});

// ==========================================
// ESQUEMAS DE PARÁMETROS DE API
// ==========================================

export const usuarioParamsSchema = z.object({
  email: emailSchema,
});

export const usuarioIdParamsSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
});

// ==========================================
// ESQUEMAS DE QUERY PARAMETERS
// ==========================================

export const usuariosQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  email: z.string().optional(),
  activo: z.coerce.boolean().optional(),
});

// ==========================================
// ESQUEMAS DE ACTIVACIÓN/DESACTIVACIÓN
// ==========================================

export const activateUsuarioSchema = z.object({
  email: emailSchema,
});

export const deactivateUsuarioSchema = z.object({
  email: emailSchema,
});
import { z } from "zod";
import {
  idSchema,
  codigoSchema,
  nombreSchema,
  capacidadSchema,
  emailSchema,
} from "./common";

/**
 * Esquemas de validación para el dominio Área, Local y Medio
 */

// ==========================================
// ESQUEMAS DE ÁREA
// ==========================================

export const createAreaSchema = z.object({
  codigo: codigoSchema,
  nombre: nombreSchema,
  directivos: z.array(emailSchema).default([]),
  almaceneros: z.array(emailSchema).default([]),
});

export const updateAreaSchema = createAreaSchema.partial();

export const findAreaSchema = z.object({
  id: idSchema,
});

export const findAreaByCodigoSchema = z.object({
  codigo: codigoSchema,
});

// ==========================================
// ESQUEMAS DE SEDE
// ==========================================

export const createSedeSchema = z.object({
  nombre: nombreSchema,
  ubicacion: z.string().max(500, "Ubicación demasiado larga").optional(),
});

export const updateSedeSchema = createSedeSchema.partial();

export const findSedeSchema = z.object({
  id: idSchema,
});

// ==========================================
// ESQUEMAS DE LOCAL
// ==========================================

export const createLocalSchema = z.object({
  codigo: codigoSchema,
  nombre: nombreSchema,
  capacidad: capacidadSchema,
  responsables: z.array(emailSchema).default([]),
  areaId: idSchema,
  sedeId: idSchema,
});

export const updateLocalSchema = createLocalSchema.partial();

export const findLocalSchema = z.object({
  id: idSchema,
});

export const findLocalByCodigoSchema = z.object({
  codigo: codigoSchema,
});

// ==========================================
// ESQUEMAS DE MEDIO
// ==========================================

export const createMedioSchema = z.object({
  codigo: codigoSchema,
  nombre: nombreSchema,
  descripcion: z.string().max(1000, "Descripción demasiado larga").optional(),
  responsables: z.array(emailSchema).default([]),
  localId: idSchema,
  areaId: idSchema,
});

export const updateMedioSchema = createMedioSchema.partial();

export const findMedioSchema = z.object({
  id: idSchema,
});

export const findMedioByCodigoSchema = z.object({
  codigo: codigoSchema,
});

// ==========================================
// ESQUEMAS DE RELACIÓN SEDE-ÁREA
// ==========================================

export const assignAreaToSedeSchema = z.object({
  sedeId: idSchema,
  areaId: idSchema,
});

export const removeAreaFromSedeSchema = z.object({
  sedeId: idSchema,
  areaId: idSchema,
});

// ==========================================
// ESQUEMAS DE GESTIÓN DE RESPONSABLES
// ==========================================

export const assignResponsableLocalSchema = z.object({
  localId: idSchema,
  email: emailSchema,
});

export const removeResponsableLocalSchema = z.object({
  localId: idSchema,
  email: emailSchema,
});

export const assignResponsableMedioSchema = z.object({
  medioId: idSchema,
  email: emailSchema,
});

export const removeResponsableMedioSchema = z.object({
  medioId: idSchema,
  email: emailSchema,
});

export const assignDirectivoAreaSchema = z.object({
  areaId: idSchema,
  email: emailSchema,
});

export const removeDirectivoAreaSchema = z.object({
  areaId: idSchema,
  email: emailSchema,
});

export const assignAlmaceneroAreaSchema = z.object({
  areaId: idSchema,
  email: emailSchema,
});

export const removeAlmaceneroAreaSchema = z.object({
  areaId: idSchema,
  email: emailSchema,
});
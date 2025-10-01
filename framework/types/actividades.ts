/**
 * Tipos para actividades y aseguramientos
 */

import type { TipoActividad, TipoAseguramiento } from '@prisma/client';

// Tipos para las configuraciones estáticas
export interface ActividadConfig {
  id: string;
  nombre: string;
  icono: string;
}

export interface AseguramientoConfig {
  id: string;
  nombre: string;
  icono: string;
  descripcion?: string;
}

// Tipos para los datos de Prisma
export type TipoActividadData = TipoActividad;
export type TipoAseguramientoData = TipoAseguramiento;

// Tipos para iconos
export type IconKey = string;

// Re-exports para conveniencia
export type { TipoActividad, TipoAseguramiento } from '@prisma/client';
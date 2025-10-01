/**
 * Barrel exports para todos los tipos del sistema
 */

// Tipos de usuario
export type {
  Usuario,
  CreateUsuarioInput,
  UpdateUsuarioInput,
  UsuarioWithRoles,
  UsuarioWithEffectiveRoles,
  UsuariosPaginatedResponse,
  UsuarioRol,
  RolesEfectivosResponse,
} from './usuario';

export { RolBase, RolSistema } from './usuario';

// Tipos comunes
export type {
  ServiceResponse,
  PaginationParams,
  PaginatedResponse,
  SearchFilters,
  AuditInfo,
} from './common';

// Tipos de actividades y aseguramientos
export type {
  ActividadConfig,
  AseguramientoConfig,
  TipoActividadData,
  TipoAseguramientoData,
  IconKey,
  TipoActividad,
  TipoAseguramiento,
} from './actividades';

// Tipos de NextAuth (re-export)
export type {} from './next-auth';
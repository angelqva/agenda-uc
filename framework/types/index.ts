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

// Tipos de NextAuth (re-export)
export type {} from './next-auth';
import { z } from "zod";
import type { RolBase, RolSistema } from "@/types";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  upsertUsuarioSchema,
  findUsuarioByEmailSchema,
  findUsuarioByIdSchema,
  findUsuariosActivosSchema,
  assignRoleSchema,
  removeRoleSchema,
  verifyRoleSchema,
  verifyBaseRoleSchema,
  activateUsuarioSchema,
  deactivateUsuarioSchema,
  usuariosQuerySchema,
  authUserDataSchema,
  syncUserFromAuthSchema,
} from "@/schemas";

/**
 * DTOs (Data Transfer Objects) para el dominio Usuario
 * Estos tipos se generan automáticamente desde los esquemas de validación
 */

// ==========================================
// DTOs DE ENTRADA - USUARIOS
// ==========================================

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;

export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;

export type UpsertUsuarioDto = z.infer<typeof upsertUsuarioSchema>;

// ==========================================
// DTOs DE CONSULTA - USUARIOS
// ==========================================

export type FindUsuarioByEmailDto = z.infer<typeof findUsuarioByEmailSchema>;

export type FindUsuarioByIdDto = z.infer<typeof findUsuarioByIdSchema>;

export type FindUsuariosActivosDto = z.infer<typeof findUsuariosActivosSchema>;

export type UsuariosQueryDto = z.infer<typeof usuariosQuerySchema>;

// ==========================================
// DTOs DE ROLES
// ==========================================

export type AssignRoleDto = z.infer<typeof assignRoleSchema>;

export type RemoveRoleDto = z.infer<typeof removeRoleSchema>;

export type VerifyRoleDto = z.infer<typeof verifyRoleSchema>;

export type VerifyBaseRoleDto = z.infer<typeof verifyBaseRoleSchema>;

// ==========================================
// DTOs DE ACTIVACIÓN
// ==========================================

export type ActivateUsuarioDto = z.infer<typeof activateUsuarioSchema>;

export type DeactivateUsuarioDto = z.infer<typeof deactivateUsuarioSchema>;

// ==========================================
// DTOs PARA AUTENTICACIÓN
// ==========================================

export type AuthUserDataDto = z.infer<typeof authUserDataSchema>;

export type SyncUserFromAuthDto = z.infer<typeof syncUserFromAuthSchema>;

// ==========================================
// DTOs DE RESPUESTA API
// ==========================================

export type UsuarioApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: any[];
};

export type RolesEfectivosApiResponse = UsuarioApiResponse<{
  email: string;
  rolesBase: RolBase[];
  rolesCalculados: RolSistema[];
  rolesEfectivos: RolSistema[];
  calculadoEn: string;
}>;

export type VerifyRoleApiResponse = UsuarioApiResponse<{
  email: string;
  rol: RolSistema;
  hasRole: boolean;
  verificadoEn: string;
}>;

export type UsuarioPaginatedApiResponse = UsuarioApiResponse<{
  usuarios: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}>;

// ==========================================
// DTOs DE VALIDACIÓN DE ENTRADA
// ==========================================

export type ValidatedCreateUsuario = {
  data: CreateUsuarioDto;
  isValid: boolean;
  errors?: z.ZodError;
};

export type ValidatedUpdateUsuario = {
  data: UpdateUsuarioDto;
  isValid: boolean;
  errors?: z.ZodError;
};

export type ValidatedAssignRole = {
  data: AssignRoleDto;
  isValid: boolean;
  errors?: z.ZodError;
};

// ==========================================
// DTOs DE SERVICIOS
// ==========================================

export type UsuarioServiceCreateInput = CreateUsuarioDto;

export type UsuarioServiceUpdateInput = UpdateUsuarioDto & {
  email: string;
};

export type UsuarioServiceUpsertInput = UpsertUsuarioDto;

export type UsuarioServiceFindOptions = {
  page?: number;
  limit?: number;
  email?: string;
  activo?: boolean;
};

// ==========================================
// DTOs DE FILTROS
// ==========================================

export type UsuarioFilters = {
  email?: string;
  activo?: boolean;
  roles?: RolBase[];
  search?: string;
};

export type UsuarioPaginationOptions = {
  page: number;
  limit: number;
  filters?: UsuarioFilters;
  orderBy?: 'createdAt' | 'updatedAt' | 'email';
  orderDirection?: 'asc' | 'desc';
};
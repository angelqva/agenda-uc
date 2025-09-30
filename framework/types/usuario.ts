/**
 * Tipos relacionados con el modelo Usuario
 */

/**
 * Enum de roles base del sistema (asignados explícitamente)
 */
export enum RolBase {
  RECTOR = "RECTOR",
  DIRECTIVO_INSTITUCIONAL = "DIRECTIVO_INSTITUCIONAL",
  ADMINISTRADOR = "ADMINISTRADOR", 
  LOGISTICO = "LOGISTICO",
}

/**
 * Enum de todos los roles posibles (base + calculados + universal)
 */
export enum RolSistema {
  // Roles base (asignados explícitamente)
  RECTOR = "RECTOR",
  DIRECTIVO_INSTITUCIONAL = "DIRECTIVO_INSTITUCIONAL", 
  ADMINISTRADOR = "ADMINISTRADOR",
  LOGISTICO = "LOGISTICO",
  // Roles calculados (derivados automáticamente)
  DIRECTIVO = "DIRECTIVO",
  ALMACENERO = "ALMACENERO",
  RESPONSABLE_LOCAL = "RESPONSABLE_LOCAL",
  RESPONSABLE_MEDIO = "RESPONSABLE_MEDIO",
  // Rol universal
  USUARIO = "USUARIO",
}

/**
 * Tipo base de usuario
 */
export type Usuario = {
  id: string;
  email: string;
  imageUrl: string | null;
  biografia: string | null;
  telefono: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Datos de entrada para crear un nuevo usuario
 */
export type CreateUsuarioInput = {
  email: string;
  imageUrl?: string;
  biografia?: string;
  telefono?: string;
};

/**
 * Datos de entrada para actualizar un usuario existente
 */
export type UpdateUsuarioInput = Partial<CreateUsuarioInput> & {
  activo?: boolean;
};

/**
 * Usuario con sus roles asignados
 */
export type UsuarioWithRoles = Usuario & {
  roles: RolBase[];
};

/**
 * Usuario con todos sus roles efectivos (base + calculados + universal)
 */
export type UsuarioWithEffectiveRoles = Usuario & {
  rolesEfectivos: RolSistema[];
};

/**
 * Respuesta paginada de usuarios
 */
export type UsuariosPaginatedResponse = {
  usuarios: Usuario[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

/**
 * Asignación de rol a usuario
 */
export type UsuarioRol = {
  id: string;
  email: string;
  rol: RolBase;
};

/**
 * Respuesta del cálculo de roles efectivos
 */
export type RolesEfectivosResponse = {
  email: string;
  rolesBase: RolBase[];
  rolesCalculados: RolSistema[];
  rolesEfectivos: RolSistema[];
  calculadoEn: Date;
};
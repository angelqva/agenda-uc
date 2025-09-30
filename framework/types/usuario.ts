/**
 * Tipos relacionados con el modelo Usuario
 */

/**
 * Enum de roles base del sistema
 */
export enum RolBase {
  ADMINISTRADOR = "ADMINISTRADOR",
  LOGISTICO = "LOGISTICO", 
  RECTOR = "RECTOR",
  DIRECTIVO_INSTITUCIONAL = "DIRECTIVO_INSTITUCIONAL",
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
/**
 * Tipos relacionados con la base de datos y servicios generales
 */

/**
 * Respuesta estándar de operaciones
 */
export type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

/**
 * Parámetros de paginación estándar
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * Respuesta paginada genérica
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

/**
 * Filtros de búsqueda genéricos
 */
export type SearchFilters = {
  search?: string;
  activo?: boolean;
  fechaDesde?: Date;
  fechaHasta?: Date;
};

/**
 * Información de auditoría
 */
export type AuditInfo = {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
};
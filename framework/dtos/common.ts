import { z } from "zod";
import {
  paginationSchema,
  searchPaginationSchema,
  rangoFechasSchema,
  rangoFechasFuturaSchema,
} from "@/schemas";

/**
 * DTOs comunes reutilizables en toda la aplicación
 */

// ==========================================
// DTOs DE PAGINACIÓN
// ==========================================

export type PaginationDto = z.infer<typeof paginationSchema>;

export type SearchPaginationDto = z.infer<typeof searchPaginationSchema>;

export type PaginationResponseDto<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// ==========================================
// DTOs DE RESPUESTA API
// ==========================================

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
  timestamp?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  message?: string;
  details?: any[];
  timestamp: string;
  path?: string;
  statusCode?: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
};

// ==========================================
// DTOs DE FILTROS
// ==========================================

export type DateRangeDto = z.infer<typeof rangoFechasSchema>;

export type FutureDateRangeDto = z.infer<typeof rangoFechasFuturaSchema>;

export type FilterDto = {
  search?: string;
  dateRange?: DateRangeDto;
  active?: boolean;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
};

export type SearchFilterDto = FilterDto & SearchPaginationDto;

// ==========================================
// DTOs DE VALIDACIÓN
// ==========================================

export type BaseValidationResult<T = any> = {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
  message?: string;
};

export type ValidatedInput<T> = {
  isValid: boolean;
  data: T;
  errors?: z.ZodError[];
};

// ==========================================
// DTOs DE AUDITORÍA
// ==========================================

export type AuditDto = {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
};

export type TraceDto = {
  actorEmail: string;
  rol: string;
  accion: string;
  entidad: string;
  entidadId: string;
  descripcion?: string;
  timestamp: Date;
};

// ==========================================
// DTOs DE METADATOS
// ==========================================

export type MetadataDto = {
  version: string;
  timestamp: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
};

// ==========================================
// DTOs DE ESTADO
// ==========================================

export type StatusDto = {
  code: number;
  message: string;
  details?: any;
};

// ==========================================
// DTOs DE CONFIGURACIÓN
// ==========================================

export type ConfigDto = {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  updatedAt?: Date;
};

// ==========================================
// DTOs DE NOTIFICACIÓN
// ==========================================

export type NotificationDto = {
  id: string;
  destinatarioEmail: string;
  titulo: string;
  descripcion: string;
  accion?: string;
  leida: boolean;
  createdAt: Date;
};

// ==========================================
// DTOs DE ARCHIVO
// ==========================================

export type FileDto = {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
  uploadedAt: Date;
  uploadedBy: string;
};

// ==========================================
// DTOs DE HEALTHCHECK
// ==========================================

export type HealthCheckDto = {
  status: 'ok' | 'error' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'ok' | 'error';
    redis?: 'ok' | 'error';
    storage?: 'ok' | 'error';
  };
};
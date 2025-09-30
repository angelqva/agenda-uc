/**
 * Tipos para manejo de errores específicos por campo
 */

// ==========================================
// TIPOS DE ERRORES POR CAMPO
// ==========================================

export type FieldError = {
  field: string;
  message: string;
  code?: string;
};

export type ValidationErrors = {
  [fieldName: string]: string[];
};

// ==========================================
// RESULTADO DE VALIDACIÓN MEJORADO
// ==========================================

export type ValidationResult<T = any> = {
  success: boolean;
  data?: T;
  fieldErrors?: ValidationErrors;
  rootError?: string;
  toast?: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  };
};

// ==========================================
// RESPUESTA DE SERVICIO MEJORADA
// ==========================================

export type ServiceResult<T = any> = {
  success: boolean;
  data?: T;
  fieldErrors?: ValidationErrors;
  rootError?: string;
  toast?: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  };
  metadata?: {
    timestamp: string;
    operation: string;
    actor?: string;
  };
};

// ==========================================
// RESPUESTA DE API MEJORADA
// ==========================================

export type ApiResult<T = any> = ServiceResult<T> & {
  statusCode?: number;
  path?: string;
  requestId?: string;
};

// ==========================================
// TIPOS DE ERRORES ESPECÍFICOS
// ==========================================

export type DatabaseError = {
  type: 'database';
  code: string;
  message: string;
  details?: any;
};

export type ValidationError = {
  type: 'validation';
  fieldErrors: ValidationErrors;
  rootMessage?: string;
};

export type BusinessError = {
  type: 'business';
  code: string;
  message: string;
  context?: any;
};

export type AuthenticationError = {
  type: 'authentication';
  message: string;
  redirectTo?: string;
};

export type AuthorizationError = {
  type: 'authorization';
  message: string;
  requiredRole?: string;
  currentRoles?: string[];
};

export type NotFoundError = {
  type: 'not_found';
  entity: string;
  identifier: string;
  message: string;
};

export type ConflictError = {
  type: 'conflict';
  entity: string;
  field: string;
  value: string;
  message: string;
};

// ==========================================
// UNIÓN DE TIPOS DE ERROR
// ==========================================

export type ServiceError = 
  | DatabaseError 
  | ValidationError 
  | BusinessError 
  | AuthenticationError 
  | AuthorizationError 
  | NotFoundError 
  | ConflictError;

// ==========================================
// CONTEXTO DE ERROR
// ==========================================

export type ErrorContext = {
  operation: string;
  actor?: string;
  timestamp: string;
  input?: any;
  metadata?: Record<string, any>;
};
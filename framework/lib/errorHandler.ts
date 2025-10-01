import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import type {
  ServiceResult,
  ValidationErrors,
  ServiceError,
  ErrorContext,
  DatabaseError,
  ValidationError,
  BusinessError,
  NotFoundError,
  ConflictError,
} from "@/dtos/errors";


/**
 * Utilidades para manejo avanzado de errores con validación por campos
 */
export class ErrorHandler {
  /**
   * Crea un resultado exitoso
   */
  static success<T>(
    data: T,
    operation: string,
    actor?: string,
    toast?: {
      type: 'success' | 'info';
      title: string;
      message: string;
    }
  ): ServiceResult<T> {
    return {
      success: true,
      data,
      toast,
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Procesa errores de Zod y los convierte a errores por campo
   */
  static fromZodError(
    error: ZodError,
    operation: string,
    actor?: string
  ): ServiceResult {
    const fieldErrors: ValidationErrors = {};
    
    error.errors.forEach((err) => {
      const fieldPath = err.path.join('.');
      if (!fieldErrors[fieldPath]) {
        fieldErrors[fieldPath] = [];
      }
      fieldErrors[fieldPath].push(err.message);
    });

    return {
      success: false,
      fieldErrors,
      rootError: "Los datos proporcionados contienen errores de validación",
      toast: {
        type: 'error',
        title: 'Datos Inválidos',
        message: 'Por favor, revisa los campos marcados en rojo',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Procesa errores de Prisma y los convierte a errores específicos
   */
  static fromPrismaError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string,
    actor?: string
  ): ServiceResult {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return this.createConflictError(error, operation, actor);
      
      case 'P2025': // Record not found
        return this.createNotFoundError(error, operation, actor);
      
      case 'P2003': // Foreign key constraint violation
        return this.createForeignKeyError(error, operation, actor);
      
      case 'P2014': // Invalid ID
        return this.createInvalidIdError(error, operation, actor);
      
      default:
        return this.createDatabaseError(error, operation, actor);
    }
  }

  /**
   * Crea un error de conflicto (duplicado)
   */
  private static createConflictError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string,
    actor?: string
  ): ServiceResult {
    const target = error.meta?.target as string[] | undefined;
    const fieldName = target?.[0] || 'field';
    
    const fieldErrors: ValidationErrors = {
      [fieldName]: ['Este valor ya está en uso. Por favor, elige otro.'],
    };

    return {
      success: false,
      fieldErrors,
      rootError: `Ya existe un registro con ese ${fieldName}`,
      toast: {
        type: 'error',
        title: 'Valor Duplicado',
        message: `Ya existe un registro con ese ${fieldName}`,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Crea un error de registro no encontrado
   */
  private static createNotFoundError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string,
    actor?: string
  ): ServiceResult {
    return {
      success: false,
      rootError: "El registro solicitado no fue encontrado",
      toast: {
        type: 'error',
        title: 'No Encontrado',
        message: 'El elemento que buscas no existe o fue eliminado',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Crea un error de clave foránea
   */
  private static createForeignKeyError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string,
    actor?: string
  ): ServiceResult {
    const fieldName = error.meta?.field_name as string || 'relacionado';
    
    const fieldErrors: ValidationErrors = {
      [fieldName]: ['El elemento seleccionado no es válido o no existe.'],
    };

    return {
      success: false,
      fieldErrors,
      rootError: "Referencia inválida detectada",
      toast: {
        type: 'error',
        title: 'Referencia Inválida',
        message: 'Uno de los elementos seleccionados no es válido',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Crea un error de ID inválido
   */
  private static createInvalidIdError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string,
    actor?: string
  ): ServiceResult {
    const fieldErrors: ValidationErrors = {
      id: ['El identificador proporcionado no tiene un formato válido.'],
    };

    return {
      success: false,
      fieldErrors,
      rootError: "Identificador inválido",
      toast: {
        type: 'error',
        title: 'ID Inválido',
        message: 'El identificador proporcionado no es válido',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Crea un error genérico de base de datos
   */
  private static createDatabaseError(
    error: Prisma.PrismaClientKnownRequestError,
    operation: string,
    actor?: string
  ): ServiceResult {
    return {
      success: false,
      rootError: "Error interno de la base de datos",
      toast: {
        type: 'error',
        title: 'Error del Sistema',
        message: 'Ocurrió un problema interno. Por favor, intenta nuevamente.',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Crea un error de negocio personalizado
   */
  static createBusinessError(
    message: string,
    operation: string,
    fieldName?: string,
    actor?: string,
    toastTitle = 'Error de Validación'
  ): ServiceResult {
    const result: ServiceResult = {
      success: false,
      rootError: message,
      toast: {
        type: 'error',
        title: toastTitle,
        message,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };

    // Si se especifica un campo, agregar error específico
    if (fieldName) {
      result.fieldErrors = {
        [fieldName]: [message],
      };
    }

    return result;
  }

  /**
   * Crea un error de autorización
   */
  static createAuthorizationError(
    requiredRole: string,
    currentRoles: string[],
    operation: string,
    actor?: string
  ): ServiceResult {
    return {
      success: false,
      rootError: `Se requiere el rol '${requiredRole}' para realizar esta operación`,
      toast: {
        type: 'error',
        title: 'Sin Permisos',
        message: 'No tienes los permisos necesarios para realizar esta acción',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }

  /**
   * Crea un error de autenticación
   */
  static createAuthenticationError(
    operation: string,
    redirectTo?: string
  ): ServiceResult {
    return {
      success: false,
      rootError: "Debes iniciar sesión para realizar esta operación",
      toast: {
        type: 'warning',
        title: 'Sesión Requerida',
        message: 'Por favor, inicia sesión para continuar',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
      },
    };
  }

  /**
   * Maneja cualquier error y lo convierte al formato estándar
   */
  static handleError(
    error: unknown,
    operation: string,
    actor?: string
  ): ServiceResult {
    console.error(`Error en operación ${operation}:`, error);

    // Error de validación Zod
    if (error instanceof ZodError) {
      return this.fromZodError(error, operation, actor);
    }

    // Error de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.fromPrismaError(error, operation, actor);
    }

    // Error estándar con mensaje
    if (error instanceof Error) {
      return {
        success: false,
        rootError: error.message,
        toast: {
          type: 'error',
          title: 'Error',
          message: error.message,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          operation,
          actor,
        },
      };
    }

    // Error desconocido
    return {
      success: false,
      rootError: "Ocurrió un error inesperado",
      toast: {
        type: 'error',
        title: 'Error Inesperado',
        message: 'Ocurrió un problema inesperado. Por favor, intenta nuevamente.',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        operation,
        actor,
      },
    };
  }
}
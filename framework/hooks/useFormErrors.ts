import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ValidationErrors, ApiResult } from '@/dtos/errors';

/**
 * Hook para manejar errores por campo y mostrar notificaciones toast
 */
export function useFormErrors() {
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Limpia todos los errores
   */
  const clearErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  /**
   * Limpia el error de un campo específico
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Establece errores desde una respuesta de API
   */
  const setErrorsFromApiResponse = useCallback((response: ApiResult) => {
    if (response.fieldErrors) {
      setFieldErrors(response.fieldErrors);
    }
    
    // Mostrar toast si existe
    if (response.toast) {
      showToast(response.toast);
    }
  }, []);

  /**
   * Obtiene el error de un campo específico
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0]; // Primer error del campo
  }, [fieldErrors]);

  /**
   * Verifica si un campo tiene errores
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return !!(fieldErrors[fieldName] && fieldErrors[fieldName].length > 0);
  }, [fieldErrors]);

  /**
   * Maneja una llamada a API con errores automáticos
   */
  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<ApiResult<T>>,
    onSuccess?: (data: T) => void,
    onError?: (error: ApiResult) => void
  ): Promise<boolean> => {
    setIsLoading(true);
    clearErrors();

    try {
      const response = await apiCall();
      
      if (response.success && response.data !== undefined) {
        // Éxito
        if (response.toast) {
          showToast(response.toast);
        }
        if (onSuccess) {
          onSuccess(response.data);
        }
        return true;
      } else {
        // Error
        setErrorsFromApiResponse(response);
        if (onError) {
          onError(response);
        }
        return false;
      }
    } catch (error) {
      // Error de red o inesperado
      const networkError: ApiResult = {
        success: false,
        rootError: 'Error de conexión',
        toast: {
          type: 'error',
          title: 'Error de Conexión',
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        },
      };
      setErrorsFromApiResponse(networkError);
      if (onError) {
        onError(networkError);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearErrors, setErrorsFromApiResponse]);

  return {
    fieldErrors,
    isLoading,
    clearErrors,
    clearFieldError,
    setErrorsFromApiResponse,
    getFieldError,
    hasFieldError,
    handleApiCall,
  };
}

/**
 * Hook específico para manejar operaciones de usuario
 */
export function useUsuarioErrors() {
  const formErrors = useFormErrors();

  /**
   * Obtiene roles efectivos de un usuario
   */
  const getRolesEfectivos = useCallback(async (email: string) => {
    return formErrors.handleApiCall(
      async () => {
        const response = await fetch(`/api/usuarios/roles/${encodeURIComponent(email)}`);
        return response.json();
      },
      (data) => {
        console.log('Roles obtenidos:', data);
      }
    );
  }, [formErrors.handleApiCall]);

  /**
   * Verifica si un usuario tiene un rol específico
   */
  const verificarRol = useCallback(async (email: string, rol: string) => {
    return formErrors.handleApiCall(
      async () => {
        const response = await fetch('/api/usuarios/verify-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, rol }),
        });
        return response.json();
      },
      (data) => {
        console.log('Verificación de rol:', data);
      }
    );
  }, [formErrors.handleApiCall]);

  return {
    ...formErrors,
    getRolesEfectivos,
    verificarRol,
  };
}

/**
 * Función auxiliar para mostrar toast usando sonner
 */
function showToast(toastData: { type: string; title: string; message: string }) {
  switch (toastData.type) {
    case 'success':
      toast.success(toastData.message, {
        description: toastData.title !== toastData.message ? toastData.title : undefined
      });
      break;
    case 'error':
      toast.error(toastData.message, {
        description: toastData.title !== toastData.message ? toastData.title : undefined
      });
      break;
    case 'warning':
      toast.warning(toastData.message, {
        description: toastData.title !== toastData.message ? toastData.title : undefined
      });
      break;
    case 'info':
      toast.info(toastData.message, {
        description: toastData.title !== toastData.message ? toastData.title : undefined
      });
      break;
    default:
      toast(toastData.message, {
        description: toastData.title !== toastData.message ? toastData.title : undefined
      });
  }
}
/**
 * Define la estructura de respuesta estándar para todos los servicios de la aplicación.
 * Esto garantiza la consistencia en el manejo de datos, errores y notificaciones.
 */
export interface ServiceResponse<T> {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Contiene los datos devueltos en caso de éxito. Es `null` si la operación falló.
   */
  data: T | null;

  /**
   * Contiene información sobre los errores, si los hubo. Es `null` si la operación fue exitosa.
   */
  errors: {
    /**
     * Errores generales no asociados a un campo específico (ej: "Error de conexión con la base de datos").
     */
    root?: string;
    /**
     * Errores de validación asociados a campos específicos.
     */
    fields?: {
      [fieldName: string]: string[] | undefined;
    };
  } | null;

  /**
   * Objeto para mostrar notificaciones (toasts) en la interfaz de usuario. Puede ser `null`.
   */
  toast: {
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success' | 'error';
  } | null;
}

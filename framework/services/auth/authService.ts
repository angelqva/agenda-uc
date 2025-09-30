import { Session } from "next-auth";

/**
 * Servicio de autenticación - Lógica de negocio relacionada con autenticación
 */
export class AuthService {
  /**
   * Obtiene información del usuario autenticado
   * @param session - Sesión de NextAuth
   * @returns Información del usuario o null si no está autenticado
   */
  static async getCurrentUser(session: Session | null) {
    if (!session?.user) {
      return null;
    }
    
    return {
      id: session.user.email || '', // Usar email como ID temporal
      email: session.user.email,
      name: session.user.name,
      // TODO: Agregar roles/permisos cuando se implementen
    };
  }

  /**
   * Verifica si el usuario tiene permisos específicos
   * @param session - Sesión de NextAuth
   * @param permission - Permiso a verificar
   * @returns true si tiene el permiso, false si no
   */
  static async hasPermission(session: Session | null, permission: string): Promise<boolean> {
    // TODO: Implementar verificación de permisos cuando se definan roles
    const user = await this.getCurrentUser(session);
    return !!user;
  }

  /**
   * Verifica si el usuario está autenticado
   * @param session - Sesión de NextAuth
   * @returns true si está autenticado, false si no
   */
  static isAuthenticated(session: Session | null): boolean {
    return !!session?.user;
  }
}
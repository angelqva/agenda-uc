/**
 * @file Opciones de configuración para NextAuth.js.
 * @description Define la estrategia de autenticación de la aplicación, utilizando
 * un proveedor de credenciales que se integra con un servicio LDAP.
 * Sigue los principios de Clean Architecture al delegar la lógica de
 * negocio al `LdapService`.
 */

import { ldapServiceProvider } from '@/services/ldap.service';
import type { LdapCredentials, LdapUser } from '@/types/ldap.types';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Instancia del servicio LDAP.
 * Se obtiene a través de un factory provider para desacoplar la creación
 * de la implementación concreta del servicio.
 */
const ldapService = ldapServiceProvider.useFactory();

/**
 * Opciones de configuración de NextAuth.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  /**
   * Proveedores de autenticación.
   * Se utiliza `CredentialsProvider` para una autenticación personalizada
   * basada en usuario y contraseña.
   */
  providers: [
    CredentialsProvider({
      /**
       * Nombre del proveedor, se mostrará en la página de inicio de sesión.
       */
      name: 'Credentials',
      /**
       * Configuración de los campos del formulario de inicio de sesión.
       * NextAuth generará automáticamente un formulario con estos campos.
       */
      credentials: {
        username: { label: 'Usuario', type: 'text', placeholder: 'nombre.apellido' },
        password: { label: 'Contraseña', type: 'password' },
      },
      /**
       * Lógica de autorización.
       * Esta función se invoca al intentar iniciar sesión.
       * Delega la validación de credenciales al servicio LDAP.
       *
       * @param credentials - Credenciales enviadas desde el formulario (username y password).
       * @returns Un objeto de usuario si la autenticación es exitosa.
       * @throws Lanza un error si la autenticación falla, que NextAuth utiliza para rechazar el inicio de sesión.
       */
      async authorize(credentials) {
        // 1. Validar que las credenciales se hayan proporcionado.
        if (!credentials?.username || !credentials?.password) {
          throw new Error('El nombre de usuario y la contraseña son obligatorios.');
        }

        // 2. Delegar la autenticación al servicio LDAP.
        const authResponse = await ldapService.authenticate(credentials as LdapCredentials);

        // 3. Procesar la respuesta del servicio.
        if (authResponse.success && authResponse.data) {
          // Si la autenticación es exitosa, retorna los datos del usuario.
          // Se añade la propiedad `id` que NextAuth espera.
          return {
            ...authResponse.data,
            id: authResponse.data.metadata?.username ?? authResponse.data.correo,
          };
        } else {
          // Si la autenticación falla, retorna `null`.
          // NextAuth se encargará de mostrar un error genérico.
          return null;
        }
      },
    }),
  ],

  /**
   * Callbacks para personalizar el comportamiento de NextAuth.
   * @see https://next-auth.js.org/configuration/callbacks
   */
  callbacks: {
    /**
     * Se invoca después de una autorización exitosa para poblar el token JWT.
     * El objeto `user` proviene del retorno de la función `authorize`.
     *
     * @param token - El token JWT que se está formando.
     * @param user - El objeto de usuario devuelto por `authorize`.
     * @returns El token JWT actualizado con los datos del usuario.
     */
    async jwt({ token, user }) {
      // El objeto `user` solo está presente en el primer inicio de sesión.
      // Se fusiona el `user` (que es LdapUser) con el token.
      if (user) {
        token.user = user;
      }
      return token;
    },
    /**
     * Se invoca para crear o actualizar el objeto de sesión.
     * El `token` es el que se formó en el callback `jwt`.
     *
     * @param session - La sesión que se enviará al cliente.
     * @param token - El token JWT con los datos del usuario.
     * @returns La sesión actualizada con los datos del usuario.
     */
    async session({ session, token }) {
      // Asigna los datos del usuario desde el token a la sesión.
      // Esto asegura que `session.user` tenga el tipo `LdapUser`.
      if (token.user) {
        session.user = token.user as LdapUser;
      }
      return session;
    },
  },

  /**
   * Configuración de las páginas de la aplicación.
   * Se puede especificar una página de inicio de sesión personalizada.
   */
  pages: {
    signIn: '/auth/signin', // Ruta a la página de inicio de sesión personalizada
  },

  /**
   * Estrategia de sesión.
   * 'jwt' es la opción recomendada para no depender de una base de datos para las sesiones.
   */
  session: {
    strategy: 'jwt',
  },

  /**
   * Clave secreta para firmar los tokens JWT.
   * Es crucial para la seguridad en producción.
   */
  secret: process.env.NEXTAUTH_SECRET,
};

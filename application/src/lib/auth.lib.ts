/**
 * @file Opciones de configuración para NextAuth.js.
 * @description Define la estrategia de autenticación de la aplicación, utilizando
 * un proveedor de credenciales que se integra con un servicio LDAP.
 * Sigue los principios de Clean Architecture al delegar la lógica de
 * negocio al `LdapService`.
 */

import { ldapServiceProvider } from '@/services/ldap.service';
import { userServiceProvider } from '@/services/user.service';
import type { LdapCredentials } from '@/types/ldap.types';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Instancias de los servicios.
 * Se obtienen a través de un factory provider para desacoplar la creación
 * de la implementación concreta del servicio.
 */
const ldapService = ldapServiceProvider.useFactory();
const userService = userServiceProvider.useFactory();

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
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text', placeholder: 'nombre.apellido' },
        password: { label: 'Contraseña', type: 'password' },
      },
      /**
       * Lógica de autorización.
       * 1. Valida las credenciales contra el servicio LDAP.
       * 2. Si la autenticación LDAP es exitosa, sincroniza el usuario con la base de datos local (crea o actualiza).
       * 3. Devuelve el usuario de la base de datos para establecer la sesión.
       *
       * @param credentials - Credenciales enviadas desde el formulario.
       * @returns Un objeto de usuario de la base de datos si el proceso es exitoso.
       * @throws Lanza un error si la autenticación o la sincronización fallan.
       */
      async authorize(credentials) {
        // 1. Validar que las credenciales se hayan proporcionado.
        if (!credentials?.username || !credentials?.password) {
          throw new Error('El nombre de usuario y la contraseña son obligatorios.');
        }

        // 2. Delegar la autenticación al servicio LDAP.
        const authResponse = await ldapService.authenticate(credentials as LdapCredentials);
        console.log('Respuesta de autenticación LDAP:', authResponse);
        // 3. Si la autenticación LDAP es exitosa, proceder a la sincronización con la BD.
        if (authResponse.success && authResponse.data) {
          const syncResponse = await userService.synchronizeUserFromLdap({
            correo: authResponse.data.correo,
            nombre: authResponse.data.nombre,
          });

          // 4. Si la sincronización es exitosa, devolver el usuario de la base de datos.
          if (syncResponse.success && syncResponse.data) {
            // NextAuth espera que el objeto de usuario tenga una propiedad `id`.
            // Nuestro `UserDto` ya la tiene, así que es compatible.
            return syncResponse.data;
          }

          // Si la sincronización falla, se lanza un error para denegar el acceso.
          console.error('Error al sincronizar el usuario:', syncResponse.errors);
          throw new Error('No se pudo inicializar el perfil de usuario en el sistema.');
        }

        // Si la autenticación LDAP falla, `authResponse` no es exitoso y se retorna null.
        return null;
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
     * El objeto `user` proviene del retorno de la función `authorize` (es el usuario de la BD).
     *
     * @param token - El token JWT que se está formando.
     * @param user - El objeto de usuario devuelto por `authorize`.
     * @returns El token JWT actualizado con los datos del usuario.
     */
    async jwt({ token, user }) {
      // El objeto `user` solo está presente en el primer inicio de sesión.
      // Se fusiona el `user` (que es UserDto) con el token.
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
      // Esto asegura que `session.user` tenga el tipo `UserDto`.
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  /**
   * Configuración de las páginas de la aplicación.
   * Se puede especificar una página de inicio de sesión personalizada.
   */
  pages: {
    signIn: '/autenticacion/iniciar-sesion', // Ruta a la página de inicio de sesión personalizada
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

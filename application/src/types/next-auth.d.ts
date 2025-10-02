import type { LdapUser } from './ldap.types';
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend built-in session
declare module "next-auth" {
    /**
     * Extiende la interfaz `Session` de NextAuth para incluir el usuario LDAP.
     * Esto permite acceder a `session.user` con el tipado correcto en el cliente.
     */
    interface Session {
        user: LdapUser;
    }

    /**
     * Extiende la interfaz `User` de NextAuth para que sea compatible con `LdapUser`.
     * NextAuth espera una propiedad `id`.
     */
    interface User extends LdapUser {
        id: string;
    }
}

declare module 'next-auth/jwt' {
  /**
   * Extiende el token JWT para incluir los datos del usuario LDAP.
   * Esto permite que los datos persistan entre callbacks.
   */
  interface JWT {
    user?: LdapUser;
  }
}


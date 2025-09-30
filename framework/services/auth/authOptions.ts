import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { UsuarioService } from "@/services/domain/usuarioService";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      console.log("Session:", { session });
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Sincronizar usuario automáticamente al iniciar sesión
        if (user.email && user.name) {
          const syncResult = await UsuarioService.syncUserFromAuth({
            email: user.email,
            name: user.name,
            image: user.image,
          });

          if (!syncResult.success) {
            console.error("Error sincronizando usuario:", syncResult.fieldErrors || syncResult.rootError);
            // Permitir login aunque falle la sincronización para no bloquear acceso
          } else {
            console.log("Usuario sincronizado exitosamente:", syncResult.data?.email);
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error en signIn callback:", error);
        // Permitir login aunque falle la sincronización
        return true;
      }
    },
  },
};
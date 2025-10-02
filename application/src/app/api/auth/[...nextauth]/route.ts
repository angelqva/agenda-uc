/**
 * @file Ruta de la API para NextAuth.js.
 * @description Este archivo exporta los handlers `GET` y `POST` para la ruta `[...nextauth]`,
 * que son necesarios para que NextAuth funcione correctamente.
 * Utiliza las opciones de configuración definidas en `auth.options.ts`.
 */

import { authOptions } from '@/lib/auth.options';
import NextAuth from 'next-auth';

/**
 * Inicializa NextAuth con las opciones de configuración.
 * El handler se encarga de todas las peticiones a `/api/auth/*`.
 */
const handler = NextAuth(authOptions);

/**
 * Exporta los handlers `GET` y `POST` para que sean utilizados por el App Router de Next.js.
 */
export { handler as GET, handler as POST };

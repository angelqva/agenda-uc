/**
 * @file Servicio para la gestión de usuarios.
 * @description Implementa la lógica de negocio para crear, buscar y gestionar usuarios,
 * siguiendo los principios de Clean Architecture.
 */

import { prisma } from '@/lib/prisma.lib';
import type { CreateUserFromLdapDto, UserDto } from '@/dtos/user.dto';
import type { ServiceResponse } from '@/types/common.types';
import { Prisma, type Usuario } from '@/generated/prisma';

/**
 * Interfaz para el servicio de usuarios.
 * Define el contrato que cualquier implementación debe seguir.
 */
export interface IUserService {
  /**
   * Busca un usuario por su correo electrónico.
   * @param email - Correo electrónico del usuario.
   * @returns Una respuesta de servicio con el usuario encontrado o null.
   */
  findUserByEmail(email: string): Promise<ServiceResponse<UserDto | null>>;

  /**
   * Busca un usuario por su correo. Si no existe, lo crea utilizando los datos de LDAP.
   * @param ldapUserDto - DTO con los datos del usuario de LDAP.
   * @returns Una respuesta de servicio con el usuario encontrado o recién creado.
   */
  /**
   * Sincroniza un usuario desde LDAP a la base de datos local.
   * Utiliza una operación `upsert`:
   * - Si el usuario no existe por su correo, lo crea.
   * - Si el usuario ya existe, actualiza su nombre.
   * Registra una traza de la operación (creación o actualización).
   *
   * @param ldapUserDto - DTO con los datos del usuario de LDAP.
   * @returns Una respuesta de servicio con el usuario sincronizado.
   */
  synchronizeUserFromLdap(
    ldapUserDto: CreateUserFromLdapDto,
  ): Promise<ServiceResponse<UserDto>>;
}

/**
 * Implementación del servicio de usuarios.
 */
export class UserService implements IUserService {
  /**
   * Busca un usuario por su correo electrónico.
   */
  async findUserByEmail(email: string): Promise<ServiceResponse<UserDto | null>> {
    try {
      const user = await prisma.usuario.findUnique({
        where: { correo: email },
      });
      return { success: true, data: user, errors: null, toast: null };
    } catch (error) {
      return {
        success: false,
        data: null,
        errors: { root: 'Error al buscar el usuario en la base de datos.' },
        toast: { title: 'Error de Base de Datos', description: 'No se pudo realizar la búsqueda.', type: 'error' },
      };
    }
  }

  /**
   * Sincroniza un usuario desde LDAP (crea o actualiza).
   */
  async synchronizeUserFromLdap(
    ldapUserDto: CreateUserFromLdapDto,
  ): Promise<ServiceResponse<UserDto>> {
    try {
      const { correo, nombre } = ldapUserDto;

      // 1. Determinar si el usuario ya existe para saber si fue una creación o actualización.
      const existingUser = await prisma.usuario.findUnique({
        where: { correo },
        select: { id: true },
      });
      const wasCreated = !existingUser;

      // 2. Realizar la operación de `upsert`.
      const user = await prisma.usuario.upsert({
        where: { correo },
        update: {
          nombre,
          activo: true, // Se asegura de que el usuario esté activo al iniciar sesión.
        },
        create: {
          correo,
          nombre,
          activo: true,
          roles: {
            create: {
              rol: 'USUARIO',
            },
          },
        },
      });

      // 3. Registrar la traza correspondiente.
      const trazaAccion = wasCreated ? 'CREACION_POR_LDAP' : 'ACTUALIZACION_POR_LDAP';
      const trazaDescripcion = wasCreated
        ? `El usuario ${nombre} (${correo}) fue creado automáticamente tras autenticación LDAP.`
        : `Los datos del usuario ${nombre} (${correo}) fueron actualizados desde LDAP.`;

      await prisma.trazaGeneral.create({
        data: {
          accion: trazaAccion,
          entidad: 'Usuario',
          entidadId: user.id,
          descripcion: trazaDescripcion,
          actorId: user.id,
          rol: 'SISTEMA',
        },
      });

      return {
        success: true,
        data: user,
        errors: null,
        toast: wasCreated
          ? {
              title: 'Usuario Creado',
              description: 'Se ha creado un nuevo perfil de usuario en el sistema.',
              type: 'success',
            }
          : null, // No mostrar toast en cada actualización, solo en la creación.
      };
    } catch (error) {
      let errorMessage = 'Error al procesar el usuario en la base de datos.';
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        errorMessage = `Error de Prisma: ${error.code}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        data: null,
        errors: { root: errorMessage },
        toast: { title: 'Error de Base de Datos', description: 'No se pudo sincronizar el usuario.', type: 'error' },
      };
    }
  }
}

/**
 * Proveedor del servicio de usuarios para inyección de dependencias.
 */
export const userServiceProvider = {
  provide: 'IUserService',
  useFactory: () => new UserService(),
};

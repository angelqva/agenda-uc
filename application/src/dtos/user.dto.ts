/**
 * @file DTOs para la entidad Usuario.
 * @description Define los objetos de transferencia de datos para la creación,
 * actualización y consulta de usuarios, siguiendo las mejores prácticas de
 * Clean Architecture y asegurando un tipado estricto.
 */

import type { LdapUser } from '@/types/ldap.types';
import type { Usuario } from '@/generated/prisma';

/**
 * DTO para crear un usuario a partir de los datos de LDAP.
 * Contiene solo los campos esenciales para la creación inicial.
 */
export type CreateUserFromLdapDto = Pick<LdapUser, 'correo' | 'nombre'>;

/**
 * DTO que representa a un usuario del sistema.
 * Se utiliza para transferir la información completa del usuario.
 */
export type UserDto = Usuario;

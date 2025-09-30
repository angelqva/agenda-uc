import { prisma } from "@/services";
import type {
  Usuario,
  CreateUsuarioInput,
  UpdateUsuarioInput,
  UsuarioWithRoles,
  UsuariosPaginatedResponse,
  RolBase,
} from "@/types";

/**
 * Servicio de dominio para la gestión de usuarios
 * Contiene toda la lógica de negocio relacionada con usuarios
 */
export class UsuarioService {
  /**
   * Busca un usuario por su email
   * @param email - Email del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  static async findByEmail(email: string): Promise<Usuario | null> {
    try {
      return await prisma.usuario.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      throw new Error("Error al buscar usuario");
    }
  }

  /**
   * Busca un usuario por su ID
   * @param id - ID del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  static async findById(id: string): Promise<Usuario | null> {
    try {
      return await prisma.usuario.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("Error al buscar usuario por ID:", error);
      throw new Error("Error al buscar usuario");
    }
  }

  /**
   * Obtiene un usuario con sus roles asignados
   * @param email - Email del usuario
   * @returns Usuario con roles o null si no existe
   */
  static async findWithRoles(email: string): Promise<UsuarioWithRoles | null> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return null;
      }

      const roles = await prisma.usuarioRol.findMany({
        where: { email },
        select: { rol: true },
      });

      return {
        ...usuario,
        roles: roles.map((r: { rol: RolBase }) => r.rol),
      };
    } catch (error) {
      console.error("Error al buscar usuario con roles:", error);
      throw new Error("Error al buscar usuario con roles");
    }
  }

  /**
   * Crea un nuevo usuario
   * @param data - Datos del usuario a crear
   * @returns Usuario creado
   */
  static async create(data: CreateUsuarioInput): Promise<Usuario> {
    try {
      return await prisma.usuario.create({
        data,
      });
    } catch (error) {
      // Manejo específico para errores de Prisma
      if (error && typeof error === 'object' && 'code' in error) {
        if ((error as any).code === "P2002") {
          throw new Error("Ya existe un usuario con ese email");
        }
      }
      console.error("Error al crear usuario:", error);
      throw new Error("Error al crear usuario");
    }
  }

  /**
   * Actualiza un usuario existente
   * @param email - Email del usuario a actualizar
   * @param data - Datos a actualizar
   * @returns Usuario actualizado
   */
  static async update(email: string, data: UpdateUsuarioInput): Promise<Usuario> {
    try {
      return await prisma.usuario.update({
        where: { email },
        data,
      });
    } catch (error) {
      // Manejo específico para errores de Prisma
      if (error && typeof error === 'object' && 'code' in error) {
        if ((error as any).code === "P2025") {
          throw new Error("Usuario no encontrado");
        }
      }
      console.error("Error al actualizar usuario:", error);
      throw new Error("Error al actualizar usuario");
    }
  }

  /**
   * Desactiva un usuario (soft delete)
   * @param email - Email del usuario a desactivar
   * @returns Usuario desactivado
   */
  static async deactivate(email: string): Promise<Usuario> {
    try {
      return await this.update(email, { activo: false });
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      throw new Error("Error al desactivar usuario");
    }
  }

  /**
   * Activa un usuario
   * @param email - Email del usuario a activar
   * @returns Usuario activado
   */
  static async activate(email: string): Promise<Usuario> {
    try {
      return await this.update(email, { activo: true });
    } catch (error) {
      console.error("Error al activar usuario:", error);
      throw new Error("Error al activar usuario");
    }
  }

  /**
   * Asigna un rol a un usuario
   * @param email - Email del usuario
   * @param rol - Rol a asignar
   * @returns Rol asignado
   */
  static async assignRole(email: string, rol: RolBase) {
    try {
      // Verificar que el usuario existe
      const usuario = await this.findByEmail(email);
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar que no tenga ya ese rol
      const existingRole = await prisma.usuarioRol.findFirst({
        where: { email, rol },
      });

      if (existingRole) {
        throw new Error("El usuario ya tiene ese rol asignado");
      }

      return await prisma.usuarioRol.create({
        data: { email, rol },
      });
    } catch (error) {
      console.error("Error al asignar rol:", error);
      throw error;
    }
  }

  /**
   * Remueve un rol de un usuario
   * @param email - Email del usuario
   * @param rol - Rol a remover
   */
  static async removeRole(email: string, rol: RolBase): Promise<void> {
    try {
      await prisma.usuarioRol.deleteMany({
        where: { email, rol },
      });
    } catch (error) {
      console.error("Error al remover rol:", error);
      throw new Error("Error al remover rol");
    }
  }

  /**
   * Verifica si un usuario tiene un rol específico
   * @param email - Email del usuario
   * @param rol - Rol a verificar
   * @returns true si tiene el rol, false si no
   */
  static async hasRole(email: string, rol: RolBase): Promise<boolean> {
    try {
      const roleAssignment = await prisma.usuarioRol.findFirst({
        where: { email, rol },
      });
      return !!roleAssignment;
    } catch (error) {
      console.error("Error al verificar rol:", error);
      return false;
    }
  }

  /**
   * Lista todos los usuarios activos con paginación
   * @param page - Página a obtener (empezando en 1)
   * @param limit - Cantidad de usuarios por página
   * @returns Lista paginada de usuarios
   */
  static async findAllActive(page = 1, limit = 10): Promise<UsuariosPaginatedResponse> {
    try {
      const skip = (page - 1) * limit;
      
      const [usuarios, total] = await Promise.all([
        prisma.usuario.findMany({
          where: { activo: true },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.usuario.count({
          where: { activo: true },
        }),
      ]);

      return {
        usuarios,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      throw new Error("Error al listar usuarios");
    }
  }

  /**
   * Crea o actualiza un usuario (upsert)
   * @param email - Email del usuario
   * @param data - Datos del usuario
   * @returns Usuario creado o actualizado
   */
  static async upsert(email: string, data: CreateUsuarioInput): Promise<Usuario> {
    try {
      return await prisma.usuario.upsert({
        where: { email },
        update: data,
        create: { ...data, email },
      });
    } catch (error) {
      console.error("Error en upsert de usuario:", error);
      throw new Error("Error al crear o actualizar usuario");
    }
  }
}
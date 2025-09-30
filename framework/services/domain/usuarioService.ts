import { prisma } from "@/services";
import { ErrorHandler } from "@/lib/errorHandler";
import type {
  Usuario,
  UsuarioWithRoles,
  UsuarioWithEffectiveRoles,
  UsuariosPaginatedResponse,
  RolBase,
  RolesEfectivosResponse,
} from "@/types";
import { RolSistema } from "@/types";
import type {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpsertUsuarioDto,
  FindUsuarioByEmailDto,
  FindUsuarioByIdDto,
  FindUsuariosActivosDto,
  AssignRoleDto,
  RemoveRoleDto,
  VerifyRoleDto,
  VerifyBaseRoleDto,
  ActivateUsuarioDto,
  DeactivateUsuarioDto,
  UsuarioServiceCreateInput,
  UsuarioServiceUpdateInput,
  UsuarioServiceUpsertInput,
  UsuarioServiceFindOptions,
  ServiceResult,
} from "@/dtos";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  upsertUsuarioSchema,
  findUsuarioByEmailSchema,
  findUsuarioByIdSchema,
  findUsuariosActivosSchema,
  assignRoleSchema,
  removeRoleSchema,
  verifyRoleSchema,
  verifyBaseRoleSchema,
  activateUsuarioSchema,
  deactivateUsuarioSchema,
} from "@/schemas";

/**
 * Servicio de dominio para la gestión de usuarios
 * Maneja roles base y calculados según la estructura organizacional
 * Utiliza DTOs, schemas y manejo avanzado de errores por campo
 */
export class UsuarioService {
  /**
   * Busca un usuario por su email
   * @param input - DTO con email del usuario a buscar
   * @returns Resultado con usuario encontrado o errores específicos
   */
  static async findByEmail(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<Usuario | null>> {
    const operation = "findByEmail";
    
    try {
      // Validar entrada
      const validated = findUsuarioByEmailSchema.parse(input);
      
      const usuario = await prisma.usuario.findUnique({
        where: { email: validated.email },
      });

      return ErrorHandler.success(
        usuario,
        operation,
        actor,
        usuario ? {
          type: 'success',
          title: 'Usuario Encontrado',
          message: `Usuario ${validated.email} encontrado exitosamente`,
        } : undefined
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Busca un usuario por su email (método auxiliar para compatibilidad)
   * @param input - DTO con email del usuario a buscar  
   * @returns Usuario encontrado o null si no existe
   */
  static async findByEmailSync(input: FindUsuarioByEmailDto): Promise<Usuario | null> {
    const result = await this.findByEmail(input);
    if (!result.success) {
      throw new Error(result.rootError || "Error al buscar usuario");
    }
    return result.data || null;
  }

  /**
   * Busca un usuario por su ID
   * @param input - DTO con ID del usuario a buscar
   * @returns Resultado con usuario encontrado o errores específicos
   */
  static async findById(input: FindUsuarioByIdDto, actor?: string): Promise<ServiceResult<Usuario | null>> {
    const operation = "findById";
    
    try {
      // Validar entrada
      const validated = findUsuarioByIdSchema.parse(input);
      
      const usuario = await prisma.usuario.findUnique({
        where: { id: validated.id },
      });

      if (!usuario) {
        return ErrorHandler.createBusinessError(
          "Usuario no encontrado",
          operation,
          "id",
          actor,
          "Usuario No Encontrado"
        );
      }

      return ErrorHandler.success(
        usuario,
        operation,
        actor,
        {
          type: 'success',
          title: 'Usuario Encontrado',
          message: `Usuario encontrado exitosamente`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Obtiene un usuario con sus roles BASE asignados explícitamente
   * @param input - DTO con email del usuario
   * @returns Resultado con usuario y roles base o errores específicos
   */
  static async findWithRoles(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<UsuarioWithRoles | null>> {
    const operation = "findWithRoles";
    
    try {
      // Validar entrada
      const validated = findUsuarioByEmailSchema.parse(input);
      
      const usuario = await prisma.usuario.findUnique({
        where: { email: validated.email },
      });

      if (!usuario) {
        return ErrorHandler.createBusinessError(
          "Usuario no encontrado",
          operation,
          "email",
          actor,
          "Usuario No Encontrado"
        );
      }

      const roles = await prisma.usuarioRol.findMany({
        where: { email: validated.email },
        select: { rol: true },
      });

      const usuarioConRoles: UsuarioWithRoles = {
        ...usuario,
        roles: roles.map((r: { rol: RolBase }) => r.rol),
      };

      return ErrorHandler.success(
        usuarioConRoles,
        operation,
        actor,
        {
          type: 'success',
          title: 'Roles Obtenidos',
          message: `Roles base del usuario obtenidos exitosamente`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Obtiene los roles efectivos de un usuario (base + calculados + universal)
   * @param input - DTO con email del usuario
   * @returns Resultado con todos los roles efectivos o errores específicos
   */
  static async getEffectiveRoles(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<RolesEfectivosResponse>> {
    const operation = "getEffectiveRoles";
    
    try {
      // Validar entrada
      const validated = findUsuarioByEmailSchema.parse(input);
      
      // Verificar que el usuario existe
      const usuarioExists = await prisma.usuario.findUnique({
        where: { email: validated.email },
        select: { id: true }
      });

      if (!usuarioExists) {
        return ErrorHandler.createBusinessError(
          "Usuario no encontrado",
          operation,
          "email",
          actor,
          "Usuario No Encontrado"
        );
      }

      // Registrar traza de consulta
      await this.registrarTraza(
        validated.email,
        "CONSULTA_ROLES",
        "Usuario",
        validated.email,
        "Consulta de roles efectivos"
      );

      // 1. Obtener roles base de UsuarioRol
      const rolesBaseRecords = await prisma.usuarioRol.findMany({
        where: { email: validated.email },
        select: { rol: true },
      });
      
      const rolesBase = rolesBaseRecords.map((r: { rol: RolBase }) => r.rol);
      const rolesCalculados: RolSistema[] = [];

      // 2. Calcular roles dinámicos

      // Buscar en Areas (directivos y almaceneros)
      const [areasDirectivo, areasAlmacenero, localesResponsable, mediosResponsable] = await Promise.all([
        prisma.area.findMany({
          where: { directivos: { has: validated.email } }
        }),
        prisma.area.findMany({
          where: { almaceneros: { has: validated.email } }
        }),
        prisma.local.findMany({
          where: { responsables: { has: validated.email } }
        }),
        prisma.medio.findMany({
          where: { responsables: { has: validated.email } }
        })
      ]);

      // Agregar roles calculados según las búsquedas
      if (areasDirectivo.length > 0) {
        rolesCalculados.push(RolSistema.DIRECTIVO);
      }
      
      if (areasAlmacenero.length > 0) {
        rolesCalculados.push(RolSistema.ALMACENERO);
      }
      
      if (localesResponsable.length > 0) {
        rolesCalculados.push(RolSistema.RESPONSABLE_LOCAL);
      }
      
      if (mediosResponsable.length > 0) {
        rolesCalculados.push(RolSistema.RESPONSABLE_MEDIO);
      }

      // 3. Combinar todos los roles (base + calculados + universal)
      const todosLosRoles = [
        RolSistema.USUARIO, // Rol universal
        ...rolesBase.map((rol: RolBase) => rol as unknown as RolSistema),
        ...rolesCalculados
      ];

      // 4. Eliminar duplicados y devolver
      const rolesEfectivos = [...new Set(todosLosRoles)];

      const rolesResponse: RolesEfectivosResponse = {
        email: validated.email,
        rolesBase,
        rolesCalculados,
        rolesEfectivos,
        calculadoEn: new Date(),
      };

      return ErrorHandler.success(
        rolesResponse,
        operation,
        actor,
        {
          type: 'success',
          title: 'Roles Calculados',
          message: `Roles efectivos calculados exitosamente para ${validated.email}`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Obtiene un usuario con todos sus roles efectivos
   * @param input - DTO con email del usuario
   * @returns Resultado con usuario y roles efectivos o errores específicos
   */
  static async findWithEffectiveRoles(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<UsuarioWithEffectiveRoles | null>> {
    const operation = "findWithEffectiveRoles";
    
    try {
      // Obtener usuario
      const usuarioResult = await this.findByEmail(input, actor);
      if (!usuarioResult.success || !usuarioResult.data) {
        return {
          success: false,
          fieldErrors: usuarioResult.fieldErrors,
          rootError: usuarioResult.rootError || "Usuario no encontrado",
          toast: usuarioResult.toast,
          metadata: usuarioResult.metadata,
        };
      }

      // Obtener roles efectivos
      const rolesResult = await this.getEffectiveRoles(input, actor);
      if (!rolesResult.success || !rolesResult.data) {
        return {
          success: false,
          fieldErrors: rolesResult.fieldErrors,
          rootError: rolesResult.rootError || "Error al calcular roles",
          toast: rolesResult.toast,
          metadata: rolesResult.metadata,
        };
      }

      const usuarioConRoles: UsuarioWithEffectiveRoles = {
        ...usuarioResult.data,
        rolesEfectivos: rolesResult.data.rolesEfectivos,
      };

      return ErrorHandler.success(
        usuarioConRoles,
        operation,
        actor,
        {
          type: 'success',
          title: 'Usuario Completo',
          message: `Usuario y roles efectivos obtenidos exitosamente`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Crea un nuevo usuario
   * @param input - DTO con datos del usuario a crear
   * @returns Resultado con usuario creado o errores específicos
   */
  static async create(input: CreateUsuarioDto, actor?: string): Promise<ServiceResult<Usuario>> {
    const operation = "create";
    
    try {
      // Validar entrada
      const validated = createUsuarioSchema.parse(input);
      
      const usuario = await prisma.usuario.create({
        data: validated,
      });

      // Registrar traza
      await this.registrarTraza(
        validated.email,
        "CREAR_USUARIO",
        "Usuario",
        usuario.id,
        `Usuario creado: ${validated.email}`
      );

      return ErrorHandler.success(
        usuario,
        operation,
        actor,
        {
          type: 'success',
          title: 'Usuario Creado',
          message: `Usuario ${validated.email} creado exitosamente`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Actualiza un usuario existente
   * @param input - DTO con email y datos a actualizar
   * @returns Usuario actualizado
   */
  static async update(input: UsuarioServiceUpdateInput): Promise<Usuario> {
    // Validar entrada combinando email y datos de actualización
    const emailValidated = findUsuarioByEmailSchema.parse({ email: input.email });
    const dataValidated = updateUsuarioSchema.parse(input);
    
    try {
      const usuario = await prisma.usuario.update({
        where: { email: emailValidated.email },
        data: dataValidated,
      });

      // Registrar traza
      await this.registrarTraza(
        emailValidated.email,
        "ACTUALIZAR_USUARIO",
        "Usuario",
        usuario.id,
        `Usuario actualizado: ${emailValidated.email}`
      );

      return usuario;
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
   * @param input - DTO con email del usuario a desactivar
   * @returns Usuario desactivado
   */
  static async deactivate(input: DeactivateUsuarioDto): Promise<Usuario> {
    // Validar entrada
    const validated = deactivateUsuarioSchema.parse(input);
    
    try {
      const usuario = await this.update({ 
        email: validated.email, 
        activo: false 
      });
      
      // Registrar traza
      await this.registrarTraza(
        validated.email,
        "DESACTIVAR_USUARIO",
        "Usuario",
        usuario.id,
        `Usuario desactivado: ${validated.email}`
      );

      return usuario;
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      throw new Error("Error al desactivar usuario");
    }
  }

  /**
   * Activa un usuario
   * @param input - DTO con email del usuario a activar
   * @returns Usuario activado
   */
  static async activate(input: ActivateUsuarioDto): Promise<Usuario> {
    // Validar entrada
    const validated = activateUsuarioSchema.parse(input);
    
    try {
      const usuario = await this.update({ 
        email: validated.email, 
        activo: true 
      });
      
      // Registrar traza
      await this.registrarTraza(
        validated.email,
        "ACTIVAR_USUARIO",
        "Usuario",
        usuario.id,
        `Usuario activado: ${validated.email}`
      );

      return usuario;
    } catch (error) {
      console.error("Error al activar usuario:", error);
      throw new Error("Error al activar usuario");
    }
  }

  /**
   * Verifica si un usuario tiene un rol específico (base o efectivo)
   * @param input - DTO con email y rol a verificar
   * @returns Resultado con verificación o errores específicos
   */
  static async hasRole(input: VerifyRoleDto, actor?: string): Promise<ServiceResult<boolean>> {
    const operation = "hasRole";
    
    try {
      // Validar entrada
      const validated = verifyRoleSchema.parse(input);
      
      const rolesResult = await this.getEffectiveRoles({ email: validated.email }, actor);
      if (!rolesResult.success || !rolesResult.data) {
        return {
          success: false,
          data: false,
          fieldErrors: rolesResult.fieldErrors,
          rootError: rolesResult.rootError || "Error al verificar roles",
          toast: rolesResult.toast,
          metadata: rolesResult.metadata,
        };
      }

      const hasRole = rolesResult.data.rolesEfectivos.includes(validated.rol);

      return ErrorHandler.success(
        hasRole,
        operation,
        actor,
        {
          type: 'info',
          title: 'Verificación Completada',
          message: `Usuario ${hasRole ? 'tiene' : 'no tiene'} el rol ${validated.rol}`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Verifica si un usuario tiene un rol BASE específico
   * @param input - DTO con email y rol base a verificar
   * @returns Resultado con verificación o errores específicos
   */
  static async hasBaseRole(input: VerifyBaseRoleDto, actor?: string): Promise<ServiceResult<boolean>> {
    const operation = "hasBaseRole";
    
    try {
      // Validar entrada
      const validated = verifyBaseRoleSchema.parse(input);
      
      const roleAssignment = await prisma.usuarioRol.findFirst({
        where: { email: validated.email, rol: validated.rol },
      });

      const hasRole = !!roleAssignment;

      return ErrorHandler.success(
        hasRole,
        operation,
        actor,
        {
          type: 'info',
          title: 'Verificación Base Completada',
          message: `Usuario ${hasRole ? 'tiene' : 'no tiene'} el rol base ${validated.rol}`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Asigna un rol BASE a un usuario
   * @param input - DTO con email y rol a asignar
   * @returns Resultado con rol asignado o errores específicos
   */
  static async assignRole(input: AssignRoleDto, actor?: string): Promise<ServiceResult<any>> {
    const operation = "assignRole";
    
    try {
      // Validar entrada
      const validated = assignRoleSchema.parse(input);
      
      // Verificar que el usuario existe
      const usuarioResult = await this.findByEmailSync({ email: validated.email });
      if (!usuarioResult) {
        return ErrorHandler.createBusinessError(
          "Usuario no encontrado",
          operation,
          "email",
          actor,
          "Usuario No Encontrado"
        );
      }

      // Verificar que no tenga ya ese rol
      const existingRole = await prisma.usuarioRol.findFirst({
        where: { email: validated.email, rol: validated.rol },
      });

      if (existingRole) {
        return ErrorHandler.createBusinessError(
          "El usuario ya tiene ese rol asignado",
          operation,
          "rol",
          actor,
          "Rol Ya Asignado"
        );
      }

      const rolAsignado = await prisma.usuarioRol.create({
        data: { email: validated.email, rol: validated.rol },
      });

      // Registrar traza
      await this.registrarTraza(
        validated.email,
        "ASIGNAR_ROL",
        "UsuarioRol",
        rolAsignado.id,
        `Rol ${validated.rol} asignado a ${validated.email}`
      );

      return ErrorHandler.success(
        rolAsignado,
        operation,
        actor,
        {
          type: 'success',
          title: 'Rol Asignado',
          message: `Rol ${validated.rol} asignado exitosamente a ${validated.email}`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Remueve un rol BASE de un usuario
   * @param input - DTO con email y rol a remover
   * @returns Resultado de la operación o errores específicos
   */
  static async removeRole(input: RemoveRoleDto, actor?: string): Promise<ServiceResult<void>> {
    const operation = "removeRole";
    
    try {
      // Validar entrada
      const validated = removeRoleSchema.parse(input);
      
      // Verificar que el usuario tiene el rol
      const existingRole = await prisma.usuarioRol.findFirst({
        where: { email: validated.email, rol: validated.rol },
      });

      if (!existingRole) {
        return ErrorHandler.createBusinessError(
          "El usuario no tiene ese rol asignado",
          operation,
          "rol",
          actor,
          "Rol No Encontrado"
        );
      }

      await prisma.usuarioRol.deleteMany({
        where: { email: validated.email, rol: validated.rol },
      });

      // Registrar traza
      await this.registrarTraza(
        validated.email,
        "REMOVER_ROL",
        "UsuarioRol",
        validated.email,
        `Rol ${validated.rol} removido de ${validated.email}`
      );

      return ErrorHandler.success(
        undefined,
        operation,
        actor,
        {
          type: 'success',
          title: 'Rol Removido',
          message: `Rol ${validated.rol} removido exitosamente de ${validated.email}`,
        }
      );

    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /**
   * Registra una traza en TrazaGeneral
   * @param actorEmail - Email del actor que realiza la acción
   * @param accion - Acción realizada
   * @param entidad - Tipo de entidad afectada
   * @param entidadId - ID de la entidad afectada
   * @param descripcion - Descripción opcional
   */
  private static async registrarTraza(
    actorEmail: string,
    accion: string,
    entidad: string,
    entidadId: string,
    descripcion?: string
  ): Promise<void> {
    try {
      // Obtener rol principal del actor para la traza
      const rolesResult = await this.getEffectiveRoles({ email: actorEmail });
      const rolPrincipal = rolesResult.success && rolesResult.data ? 
        rolesResult.data.rolesEfectivos[1] || "USUARIO" : "USUARIO";

      await prisma.trazaGeneral.create({
        data: {
          actorEmail,
          rol: rolPrincipal,
          accion,
          entidad,
          entidadId,
          descripcion,
        },
      });
    } catch (error) {
      // No lanzar error para no interrumpir la operación principal
      console.error("Error al registrar traza:", error);
    }
  }
}
import { prisma } from "@/services";
import { ErrorHandler } from "@/lib/errorHandler";
import type {
  Usuario,
  UsuarioWithRoles,
  UsuarioWithEffectiveRoles,
  RolBase,
  RolesEfectivosResponse,
} from "@/types";
import { RolSistema } from "@/types";
import type {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  FindUsuarioByEmailDto,
  FindUsuarioByIdDto,
  AssignRoleDto,
  RemoveRoleDto,
  VerifyRoleDto,
  VerifyBaseRoleDto,
  ActivateUsuarioDto,
  DeactivateUsuarioDto,
  ServiceResult,
} from "@/dtos";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  findUsuarioByEmailSchema,
  findUsuarioByIdSchema,
  assignRoleSchema,
  removeRoleSchema,
  verifyRoleSchema,
  verifyBaseRoleSchema,
  syncUserFromAuthSchema,
} from "@/schemas";

export class UsuarioService {
  /** Buscar usuario por email */
  static async findByEmail(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<Usuario | null>> {
    const operation = "findByEmail";
    try {
      const { email } = findUsuarioByEmailSchema.parse(input);
      const usuario = await prisma.usuario.findUnique({ where: { email } });

      return usuario
        ? ErrorHandler.success(usuario, operation, actor, {
          type: "success",
          title: "Usuario Encontrado",
          message: `Usuario ${email} encontrado exitosamente`,
        })
        : ErrorHandler.success(null, operation, actor);
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Buscar usuario por ID */
  static async findById(input: FindUsuarioByIdDto, actor?: string): Promise<ServiceResult<Usuario | null>> {
    const operation = "findById";
    try {
      const { id } = findUsuarioByIdSchema.parse(input);
      const usuario = await prisma.usuario.findUnique({ where: { id } });

      if (!usuario) {
        return ErrorHandler.createBusinessError("Usuario no encontrado", operation, "id", actor, "Usuario No Encontrado");
      }
      return ErrorHandler.success(usuario, operation, actor, {
        type: "success",
        title: "Usuario Encontrado",
        message: `Usuario encontrado exitosamente`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Usuario con roles BASE */
  static async findWithRoles(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<UsuarioWithRoles | null>> {
    const operation = "findWithRoles";
    try {
      const { email } = findUsuarioByEmailSchema.parse(input);
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        return ErrorHandler.createBusinessError("Usuario no encontrado", operation, "email", actor, "Usuario No Encontrado");
      }
      const roles = await prisma.usuarioRol.findMany({ where: { email }, select: { rol: true } });
      return ErrorHandler.success<UsuarioWithRoles>(
        { ...usuario, roles: roles.map((r) => r.rol as RolBase) },
        operation,
        actor,
        { type: "success", title: "Roles Obtenidos", message: "Roles base obtenidos exitosamente" }
      );
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Roles efectivos: base + calculados + universal */
  static async getEffectiveRoles(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<RolesEfectivosResponse>> {
    const operation = "getEffectiveRoles";
    try {
      const { email } = findUsuarioByEmailSchema.parse(input);

      const exists = await prisma.usuario.findUnique({ where: { email }, select: { id: true } });
      if (!exists) {
        return ErrorHandler.createBusinessError("Usuario no encontrado", operation, "email", actor);
      }

      const rolesBaseRecords = await prisma.usuarioRol.findMany({ where: { email }, select: { rol: true } });
      const rolesBase = rolesBaseRecords.map((r) => r.rol as RolBase);

      const calculados = await prisma.$queryRaw<
        { esDirectivo: boolean; esAlmacenero: boolean; esRespLocal: boolean; esRespMedio: boolean }[]
      >`
        SELECT
          EXISTS(SELECT 1 FROM "Area" a WHERE ${email} = ANY(a."directivos")) AS "esDirectivo",
          EXISTS(SELECT 1 FROM "Area" a WHERE ${email} = ANY(a."almaceneros")) AS "esAlmacenero",
          EXISTS(SELECT 1 FROM "Local" l WHERE ${email} = ANY(l."responsables")) AS "esRespLocal",
          EXISTS(SELECT 1 FROM "Medio" m WHERE ${email} = ANY(m."responsables")) AS "esRespMedio"
      `;

      const flags = calculados[0];
      const rolesCalculados: RolSistema[] = [];
      if (flags.esDirectivo) rolesCalculados.push(RolSistema.DIRECTIVO);
      if (flags.esAlmacenero) rolesCalculados.push(RolSistema.ALMACENERO);
      if (flags.esRespLocal) rolesCalculados.push(RolSistema.RESPONSABLE_LOCAL);
      if (flags.esRespMedio) rolesCalculados.push(RolSistema.RESPONSABLE_MEDIO);

      const rolesEfectivos = [...new Set([RolSistema.USUARIO, ...rolesBase, ...rolesCalculados])]
        .filter((r): r is RolSistema => Object.values(RolSistema).includes(r as RolSistema));

      return ErrorHandler.success<RolesEfectivosResponse>(
        { email, rolesBase, rolesCalculados, rolesEfectivos, calculadoEn: new Date() },
        operation,
        actor,
        { type: "success", title: "Roles Calculados", message: `Roles efectivos calculados para ${email}` }
      );
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Usuario con roles efectivos */
  static async findWithEffectiveRoles(input: FindUsuarioByEmailDto, actor?: string): Promise<ServiceResult<UsuarioWithEffectiveRoles | null>> {
    const operation = "findWithEffectiveRoles";
    try {
      const usuarioResult = await this.findByEmail(input, actor);
      if (!usuarioResult.success || !usuarioResult.data) {
        return ErrorHandler.success<UsuarioWithEffectiveRoles | null>(
          usuarioResult.data
            ? { ...(usuarioResult.data as Usuario), rolesEfectivos: [] }
            : null,
          operation,
          actor
        );
      }

      const rolesResult = await this.getEffectiveRoles(input, actor);
      if (!rolesResult.success || !rolesResult.data) {
        return ErrorHandler.success<UsuarioWithEffectiveRoles | null>(
          usuarioResult.data
            ? { ...(usuarioResult.data as Usuario), rolesEfectivos: [] }
            : null,
          operation,
          actor
        );
      }

      return ErrorHandler.success<UsuarioWithEffectiveRoles>(
        { ...usuarioResult.data, rolesEfectivos: rolesResult.data.rolesEfectivos },
        operation,
        actor,
        { type: "success", title: "Usuario Completo", message: "Usuario con roles efectivos obtenido" }
      );
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Crear usuario */
  static async create(input: CreateUsuarioDto, actor?: string): Promise<ServiceResult<Usuario>> {
    const operation = "create";
    try {
      const validated = createUsuarioSchema.parse(input);
      const usuario = await prisma.usuario.create({ data: validated });

      await this.registrarTraza(validated.email, "CREAR_USUARIO", "Usuario", usuario.id, `Usuario creado: ${validated.email}`);

      return ErrorHandler.success(usuario, operation, actor, {
        type: "success",
        title: "Usuario Creado",
        message: `Usuario ${validated.email} creado exitosamente`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Actualizar usuario */
  static async update(input: UpdateUsuarioDto & { email: string }): Promise<Usuario> {
    const { email } = findUsuarioByEmailSchema.parse({ email: input.email });
    const data = updateUsuarioSchema.parse(input);

    try {
      const usuario = await prisma.usuario.update({ where: { email }, data });
      await this.registrarTraza(email, "ACTUALIZAR_USUARIO", "Usuario", usuario.id, `Usuario actualizado: ${email}`);
      return usuario;
    } catch (error: any) {
      if (error.code === "P2025") throw new Error("Usuario no encontrado");
      throw new Error("Error al actualizar usuario");
    }
  }

  /** Activar / desactivar */
  static async activate(input: ActivateUsuarioDto) {
    return this.update({ ...input, activo: true });
  }
  static async deactivate(input: DeactivateUsuarioDto) {
    return this.update({ ...input, activo: false });
  }

  /** Verificar rol efectivo */
  static async hasRole(input: VerifyRoleDto, actor?: string): Promise<ServiceResult<boolean>> {
    const operation = "hasRole";
    try {
      const { email, rol } = verifyRoleSchema.parse(input);
      const rolesResult = await this.getEffectiveRoles({ email }, actor);
      if (!rolesResult.success || !rolesResult.data) return rolesResult as any;

      const hasRole = rolesResult.data.rolesEfectivos.includes(rol);
      return ErrorHandler.success(hasRole, operation, actor, {
        type: "info",
        title: "Verificación",
        message: `Usuario ${hasRole ? "tiene" : "no tiene"} el rol ${rol}`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Verificar rol base */
  static async hasBaseRole(input: VerifyBaseRoleDto, actor?: string): Promise<ServiceResult<boolean>> {
    const operation = "hasBaseRole";
    try {
      const { email, rol } = verifyBaseRoleSchema.parse(input);
      const roleAssignment = await prisma.usuarioRol.findFirst({ where: { email, rol } });
      return ErrorHandler.success(!!roleAssignment, operation, actor, {
        type: "info",
        title: "Verificación Base",
        message: `Usuario ${roleAssignment ? "tiene" : "no tiene"} el rol base ${rol}`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Asignar rol base */
  static async assignRole(input: AssignRoleDto, actor?: string): Promise<ServiceResult<any>> {
    const operation = "assignRole";
    try {
      const { email, rol } = assignRoleSchema.parse(input);

      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) return ErrorHandler.createBusinessError("Usuario no encontrado", operation, "email", actor);

      const existing = await prisma.usuarioRol.findFirst({ where: { email, rol } });
      if (existing) return ErrorHandler.createBusinessError("Rol ya asignado", operation, "rol", actor);

      const rolAsignado = await prisma.usuarioRol.create({ data: { email, rol } });
      await this.registrarTraza(email, "ASIGNAR_ROL", "UsuarioRol", rolAsignado.id, `Rol ${rol} asignado a ${email}`);

      return ErrorHandler.success(rolAsignado, operation, actor, {
        type: "success",
        title: "Rol Asignado",
        message: `Rol ${rol} asignado a ${email}`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Remover rol base */
  static async removeRole(input: RemoveRoleDto, actor?: string): Promise<ServiceResult<void>> {
    const operation = "removeRole";
    try {
      const { email, rol } = removeRoleSchema.parse(input);
      const existing = await prisma.usuarioRol.findFirst({ where: { email, rol } });
      if (!existing) return ErrorHandler.createBusinessError("Rol no encontrado", operation, "rol", actor);

      await prisma.usuarioRol.deleteMany({ where: { email, rol } });
      await this.registrarTraza(email, "REMOVER_ROL", "UsuarioRol", email, `Rol ${rol} removido de ${email}`);

      return ErrorHandler.success(undefined, operation, actor, {
        type: "success",
        title: "Rol Removido",
        message: `Rol ${rol} removido de ${email}`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Sincronizar usuario desde auth */
  static async syncUserFromAuth(userData: unknown): Promise<ServiceResult<Usuario>> {
    const operation = "syncUserFromAuth";
    const actor = "SISTEMA";
    try {
      const validated = syncUserFromAuthSchema.parse(userData);
      const existing = await prisma.usuario.findUnique({ where: { email: validated.email } });

      const usuario = existing
        ? await prisma.usuario.update({
          where: { email: validated.email },
          data: {
            nombre: validated.name,
            imageUrl: validated.image || existing.imageUrl,
            lastLoginAt: new Date(),
            activo: true,
          },
        })
        : await prisma.usuario.create({
          data: {
            email: validated.email,
            nombre: validated.name,
            imageUrl: validated.image,
            biografia: "",
            telefono: "",
            activo: true,
            lastLoginAt: new Date(),
          },
        });

      return ErrorHandler.success(usuario, operation, actor, {
        type: existing ? "info" : "success",
        title: existing ? "Usuario Actualizado" : "Cuenta Creada",
        message: existing ? `Bienvenido de nuevo, ${validated.name}` : `¡Bienvenido, ${validated.name}!`,
      });
    } catch (error) {
      return ErrorHandler.handleError(error, operation, actor);
    }
  }

  /** Traza */
  private static async registrarTraza(actorEmail: string, accion: string, entidad: string, entidadId: string, descripcion?: string, rol = "USUARIO") {
    try {
      await prisma.trazaGeneral.create({ data: { actorEmail, rol, accion, entidad, entidadId, descripcion } });
    } catch (error) {
      console.error("Error al registrar traza:", error);
    }
  }
}

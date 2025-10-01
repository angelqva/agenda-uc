import { Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'ldapts';
import { PrismaService } from '../prisma.service';
import { LoginDto, JwtPayload, UserProfile, LoginResponse } from './auth.dto';
import { AUTH_CONFIG, AuthTraceType } from './auth.config';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Autenticación LDAP y creación de sesión JWT
   */
  async ldapLogin(loginDto: LoginDto, clientIp?: string): Promise<{ response: LoginResponse; token: string }> {
    const { username, password } = loginDto;
    
    this.logger.log(`Intento de login LDAP para usuario: ${username}`);

    try {
      // 1. Validar credenciales contra LDAP
      const ldapUserInfo = await this.validateLdapCredentials(username, password);
      
      // 2. Buscar o crear usuario en la base de datos
      const user = await this.findOrCreateUser(ldapUserInfo);
      
      // 3. Obtener roles del usuario
      const userRoles = await this.getUserRoles(user.id);
      
      // 4. Generar JWT
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        roles: userRoles,
      };
      
      const token = this.jwtService.sign(payload);
      
      // 5. Registrar traza de login exitoso
      await this.createAuthTrace(AuthTraceType.LOGIN_LDAP, user.id, `Login exitoso desde IP: ${clientIp}`, clientIp);
      
      // 6. Preparar respuesta
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: userRoles,
      };

      const response: LoginResponse = {
        success: true,
        message: 'Login exitoso',
        user: userProfile,
      };

      this.logger.log(`Login exitoso para usuario: ${username} (ID: ${user.id})`);
      
      return { response, token };
      
    } catch (error) {
      this.logger.error(`Error en login LDAP para usuario ${username}:`, error);
      
      // Registrar traza de login fallido
      await this.createAuthTrace(
        AuthTraceType.LOGIN_FAILED_LDAP, 
        null, 
        `Login fallido para usuario: ${username}. Error: ${error.message}`,
        clientIp
      );
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error interno durante la autenticación');
    }
  }

  /**
   * Logout: limpiar sesión
   */
  async ldapLogout(userId: string, clientIp?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Registrar traza de logout
      await this.createAuthTrace(AuthTraceType.LOGOUT_LDAP, userId, `Logout desde IP: ${clientIp}`, clientIp);
      
      this.logger.log(`Logout exitoso para usuario ID: ${userId}`);
      
      return {
        success: true,
        message: 'Logout exitoso',
      };
      
    } catch (error) {
      this.logger.error(`Error en logout para usuario ${userId}:`, error);
      throw new InternalServerErrorException('Error durante el logout');
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const roles = await this.getUserRoles(userId);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
      };
      
    } catch (error) {
      this.logger.error(`Error obteniendo perfil para usuario ${userId}:`, error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error obteniendo el perfil del usuario');
    }
  }

  /**
   * Validar token JWT
   */
  async validateJwtPayload(payload: JwtPayload): Promise<UserProfile> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: payload.roles,
    };
  }

  /**
   * Validar credenciales contra LDAP
   */
  private async validateLdapCredentials(username: string, password: string): Promise<any> {
    const client = new Client({
      url: AUTH_CONFIG.LDAP_CONFIG.url,
      timeout: 5000,
      connectTimeout: 10000,
    });

    try {
      this.logger.log(`Conectando a LDAP: ${AUTH_CONFIG.LDAP_CONFIG.url}`);
      this.logger.log(`Usando bind DN: ${AUTH_CONFIG.LDAP_CONFIG.bindDN}`);
      this.logger.log(`Base DN: ${AUTH_CONFIG.LDAP_CONFIG.baseDN}`);
      
      // Conectar al servidor LDAP con usuario de servicio
      await client.bind(AUTH_CONFIG.LDAP_CONFIG.bindDN, AUTH_CONFIG.LDAP_CONFIG.bindPassword);
      this.logger.log(`Bind exitoso con usuario de servicio`);
      
      // Buscar el usuario
      const searchFilter = AUTH_CONFIG.LDAP_CONFIG.searchFilter.replace('{{username}}', username);
      this.logger.log(`Buscando usuario con filtro: ${searchFilter}`);
      
      const searchResult = await client.search(AUTH_CONFIG.LDAP_CONFIG.baseDN, {
        scope: 'sub',
        filter: searchFilter,
        attributes: ['sAMAccountName', 'cn', 'mail', 'givenName', 'sn', 'userPrincipalName'],
      });

      if (!searchResult.searchEntries || searchResult.searchEntries.length === 0) {
        this.logger.warn(`Usuario no encontrado en LDAP: ${username}`);
        throw new UnauthorizedException('Usuario no encontrado en LDAP');
      }

      const userEntry = searchResult.searchEntries[0];
      this.logger.log(`Usuario encontrado: ${userEntry.dn}`);
      
      // Intentar autenticar con las credenciales del usuario
      try {
        await client.bind(userEntry.dn, password);
        this.logger.log(`Autenticación LDAP exitosa para: ${username}`);
        
        return {
          sAMAccountName: userEntry.sAMAccountName,
          cn: userEntry.cn,
          email: userEntry.mail || userEntry.userPrincipalName,
          givenName: userEntry.givenName,
          sn: userEntry.sn,
          dn: userEntry.dn,
        };
        
      } catch (bindError) {
        this.logger.warn(`Credenciales incorrectas para usuario: ${username}`);
        this.logger.warn(`Error de bind: ${bindError.message}`);
        throw new UnauthorizedException('Credenciales incorrectas');
      }
      
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error('Error conectando a LDAP:', error);
      
      // Diagnosticar tipo de error
      if (error.code === 49) {
        this.logger.error('Error 49: Credenciales de bind incorrectas');
        throw new UnauthorizedException('Error de configuración LDAP - credenciales de servicio incorrectas');
      }
      
      if (error.code === 'ECONNREFUSED') {
        this.logger.error('Error de conexión: Servidor LDAP no accesible');
        throw new InternalServerErrorException('Servidor LDAP no disponible');
      }
      
      throw new InternalServerErrorException('Error de conexión con el servidor LDAP');
      
    } finally {
      try {
        await client.unbind();
      } catch (unbindError) {
        this.logger.warn('Error cerrando conexión LDAP:', unbindError);
      }
    }
  }

  /**
   * Buscar o crear usuario en la base de datos
   */
  private async findOrCreateUser(ldapUser: any): Promise<any> {
    const userEmail = Array.isArray(ldapUser.email) ? ldapUser.email[0] : ldapUser.email;
    
    const existingUser = await this.prisma.usuario.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        roles: true,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    console.log('Creating new user for:', ldapUser.cn);
    
    // Crear nuevo usuario y asignar rol USER por defecto
    const newUser = await this.prisma.usuario.create({
      data: {
        id: createId(),
        email: userEmail,
        name: Array.isArray(ldapUser.givenName) ? ldapUser.givenName[0] || ldapUser.cn : (ldapUser.givenName || ldapUser.cn),
        imageUrl: null,
        roles: {
          create: {
            rol: 'USUARIO',
          },
        },
      },
      include: {
        roles: true,
      },
    });

    return newUser;
  }

  /**
   * Obtener roles del usuario
   */
  private async getUserRoles(userId: string): Promise<string[]> {
    const userRoles = await this.prisma.usuarioRol.findMany({
      where: { usuarioId: userId },
      select: { rol: true },
    });

    return userRoles.map(ur => ur.rol);
  }

  /**
   * Crear traza de autenticación
   */
  private async createAuthTrace(
    tipo: AuthTraceType, 
    usuarioId: string | null, 
    descripcion: string, 
    ip?: string
  ): Promise<void> {
    try {
      await this.prisma.trazaGeneral.create({
        data: {
          id: createId(),
          actorId: usuarioId,
          rol: 'SISTEMA',
          accion: tipo,
          entidad: 'AUTH',
          entidadId: usuarioId || 'UNKNOWN',
          descripcion,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error creando traza de autenticación:', error);
      // No lanzar error para evitar interrumpir el flujo principal
    }
  }
}
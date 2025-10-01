import { Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'ldapts';
import { PrismaService } from '../prisma.service';
import { 
  LoginDto, 
  JwtPayload, 
  RefreshTokenPayload,
  UserProfile, 
  LoginResponse,
  RefreshResponse,
  ApiResponse 
} from './auth.dto';
import { AUTH_CONFIG, AuthTraceType } from './auth.config';
import { createId } from '@paralleldrive/cuid2';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Autenticación LDAP y creación de sesión JWT con refresh token
   */
  async ldapLogin(
    loginDto: LoginDto, 
    response: Response,
    clientIp?: string
  ): Promise<LoginResponse> {
    const { username, password } = loginDto;
    
    this.logger.log(`Intento de login LDAP para usuario: ${username}`);

    try {
      // 1. Validar credenciales contra LDAP
      const ldapUserInfo = await this.validateLdapCredentials(username, password);
      
      // 2. Buscar o crear usuario en la base de datos
      const user = await this.findOrCreateUser(ldapUserInfo);
      
      // 3. Obtener roles del usuario
      const userRoles = await this.getUserRoles(user.id);
      
      // 4. Generar tokens
      const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, userRoles);
      
      // 5. Establecer refresh token como cookie httpOnly
      this.setRefreshTokenCookie(response, refreshToken);
      
      // 6. Actualizar último login
      await this.prisma.usuario.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
      
      // 7. Registrar traza de login exitoso
      await this.createAuthTrace(
        AuthTraceType.LOGIN_LDAP, 
        user.id, 
        `Login exitoso desde IP: ${clientIp}`, 
        clientIp
      );
      
      // 8. Preparar respuesta
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: userRoles,
      };

      this.logger.log(`Login exitoso para usuario: ${username} (ID: ${user.id})`);
      
      return {
        success: true,
        message: 'Login exitoso',
        user: userProfile,
        accessToken,
      };
      
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
   * Refresh access token usando refresh token de cookie
   */
  async refreshAccessToken(
    refreshTokenFromCookie: string,
    response: Response
  ): Promise<RefreshResponse> {
    try {
      // 1. Verificar refresh token
      const payload = this.jwtService.verify<RefreshTokenPayload>(refreshTokenFromCookie, {
        secret: AUTH_CONFIG.JWT_REFRESH_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // 2. Verificar que el usuario existe
      const user = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
        include: { roles: true }
      });

      if (!user || !user.activo) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }

      // 3. Obtener roles actualizados
      const userRoles = await this.getUserRoles(user.id);

      // 4. Generar nuevo access token
      const accessToken = await this.generateAccessToken(user.id, user.email, userRoles);

      // 5. Generar nuevo refresh token y rotarlo
      const newRefreshToken = await this.generateRefreshToken(user.id);
      this.setRefreshTokenCookie(response, newRefreshToken);

      this.logger.log(`Token renovado para usuario ID: ${user.id}`);

      return {
        success: true,
        message: 'Token renovado exitosamente',
        accessToken,
      };

    } catch (error) {
      this.logger.error('Error renovando token:', error);
      
      // Limpiar cookie si el refresh token es inválido
      this.clearRefreshTokenCookie(response);
      
      throw new UnauthorizedException('Sesión expirada');
    }
  }

  /**
   * Logout: limpiar cookies y revocar tokens
   */
  async ldapLogout(
    userId: string, 
    response: Response,
    clientIp?: string
  ): Promise<ApiResponse> {
    try {
      // Limpiar refresh token cookie
      this.clearRefreshTokenCookie(response);
      
      // Registrar traza de logout
      await this.createAuthTrace(
        AuthTraceType.LOGOUT_LDAP, 
        userId, 
        `Logout desde IP: ${clientIp}`, 
        clientIp
      );
      
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
   * Validar token JWT para el Guard
   */
  async validateJwtPayload(payload: JwtPayload): Promise<UserProfile> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.activo) {
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
   * Generar access token y refresh token
   */
  private async generateTokens(userId: string, email: string, roles: string[]) {
    const accessToken = await this.generateAccessToken(userId, email, roles);
    const refreshToken = await this.generateRefreshToken(userId);
    
    return { accessToken, refreshToken };
  }

  /**
   * Generar access token (corta duración)
   */
  private async generateAccessToken(userId: string, email: string, roles: string[]): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      roles,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: AUTH_CONFIG.JWT_SECRET,
      expiresIn: '15m', // 15 minutos
    });
  }

  /**
   * Generar refresh token (larga duración)
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const tokenId = createId();
    
    const payload: RefreshTokenPayload = {
      sub: userId,
      type: 'refresh',
      tokenId,
    };

    return this.jwtService.sign(payload, {
      secret: AUTH_CONFIG.JWT_REFRESH_SECRET,
      expiresIn: '7d', // 7 días
    });
  }

  /**
   * Establecer refresh token como cookie httpOnly
   */
  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction, // Solo HTTPS en producción
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
      path: '/api/auth',
    });
  }

  /**
   * Limpiar refresh token cookie
   */
  private clearRefreshTokenCookie(response: Response): void {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    });
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
      
      // Conectar al servidor LDAP con usuario de servicio
      await client.bind(AUTH_CONFIG.LDAP_CONFIG.bindDN, AUTH_CONFIG.LDAP_CONFIG.bindPassword);
      
      // Buscar el usuario
      const searchFilter = AUTH_CONFIG.LDAP_CONFIG.searchFilter.replace('{{username}}', username);
      
      const searchResult = await client.search(AUTH_CONFIG.LDAP_CONFIG.baseDN, {
        scope: 'sub',
        filter: searchFilter,
        attributes: ['sAMAccountName', 'cn', 'mail', 'givenName', 'sn', 'userPrincipalName'],
      });

      if (!searchResult.searchEntries || searchResult.searchEntries.length === 0) {
        throw new UnauthorizedException('Usuario no encontrado en LDAP');
      }

      const userEntry = searchResult.searchEntries[0];
      
      // Intentar autenticar con las credenciales del usuario
      try {
        await client.bind(userEntry.dn, password);
        
        return {
          sAMAccountName: userEntry.sAMAccountName,
          cn: userEntry.cn,
          email: userEntry.mail || userEntry.userPrincipalName,
          givenName: userEntry.givenName,
          sn: userEntry.sn,
          dn: userEntry.dn,
        };
        
      } catch (bindError) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }
      
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error('Error conectando a LDAP:', error);
      throw new InternalServerErrorException('Error de conexión LDAP');
      
    } finally {
      try {
        await client.unbind();
      } catch (e) {
        // Ignorar errores de unbind
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
    
    // Crear nuevo usuario y asignar rol USUARIO por defecto
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
      // No lanzar error para no interrumpir el flujo principal
    }
  }
}
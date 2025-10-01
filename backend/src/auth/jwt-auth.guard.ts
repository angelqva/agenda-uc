import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload, JwtPayloadSchema } from './auth.dto';
import { AUTH_CONFIG } from './auth.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    try {
      // Extraer token de la cookie
      const token = this.extractTokenFromCookie(request);
      
      if (!token) {
        this.logger.warn('Token no encontrado en las cookies');
        throw new UnauthorizedException('Token de acceso requerido');
      }

      // Verificar y decodificar el token
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: AUTH_CONFIG.JWT_SECRET,
      });

      // Validar estructura del payload
      const validatedPayload = JwtPayloadSchema.parse(payload);

      // Validar que el usuario sigue siendo válido
      const user = await this.authService.validateJwtPayload(validatedPayload);

      // Agregar información del usuario al request
      (request as any).user = user;
      (request as any).jwtPayload = validatedPayload;

      return true;

    } catch (error) {
      this.logger.warn(`Error de autenticación: ${error.message}`);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }

      throw new UnauthorizedException('Acceso no autorizado');
    }
  }

  private extractTokenFromCookie(request: Request): string | null {
    const cookies = request.cookies;
    return cookies?.[AUTH_CONFIG.COOKIE_NAME] || null;
  }
}
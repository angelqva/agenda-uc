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
      // Extraer token del header Authorization
      const token = this.extractTokenFromHeader(request);
      
      if (!token) {
        this.logger.warn('Token no encontrado en el header Authorization');
        throw new UnauthorizedException('Token de acceso requerido');
      }

      // Verificar y decodificar el token
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: AUTH_CONFIG.JWT_SECRET,
      });

      // Validar estructura del payload
      const validatedPayload = JwtPayloadSchema.parse(payload);

      // Verificar que es un access token
      if (validatedPayload.type !== 'access') {
        throw new UnauthorizedException('Token de tipo inválido');
      }

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

      if (error.name === 'ZodError') {
        throw new UnauthorizedException('Estructura de token inválida');
      }

      throw new UnauthorizedException('Acceso no autorizado');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authorization = request.headers.authorization;
    
    if (!authorization) {
      return null;
    }

    const [type, token] = authorization.split(' ');
    
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
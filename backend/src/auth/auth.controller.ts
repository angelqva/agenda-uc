import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Res, 
  Req, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { LoginDto } from './auth.dto';
import { LoginDtoSchema } from './auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Login LDAP con refresh token en cookie
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    try {
      // Validar DTO
      const validatedDto = LoginDtoSchema.parse(loginDto);
      
      // Obtener IP del cliente
      const clientIp = request.ip || request.connection.remoteAddress || 'unknown';
      
      this.logger.log(`Intento de login para usuario: ${validatedDto.username} desde IP: ${clientIp}`);
      
      // Realizar login
      const result = await this.authService.ldapLogin(validatedDto, response, clientIp);
      
      return result;
      
    } catch (error) {
      this.logger.error('Error en login:', error.message);
      
      if (error.name === 'ZodError') {
        throw new UnauthorizedException('Datos de login inválidos');
      }
      
      throw error;
    }
  }

  /**
   * Refresh access token usando refresh token de cookie
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken = request.cookies?.refreshToken;
      
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token no encontrado');
      }
      
      const result = await this.authService.refreshAccessToken(refreshToken, response);
      
      return result;
      
    } catch (error) {
      this.logger.error('Error en refresh:', error.message);
      throw error;
    }
  }

  /**
   * Logout: limpiar cookies
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = request.user as any;
      const clientIp = request.ip || request.connection.remoteAddress || 'unknown';
      
      const result = await this.authService.ldapLogout(user.id, response, clientIp);
      
      return result;
      
    } catch (error) {
      this.logger.error('Error en logout:', error.message);
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: Request) {
    try {
      const user = request.user as any;
      
      const profile = await this.authService.getProfile(user.id);
      
      return {
        success: true,
        message: 'Perfil obtenido exitosamente',
        user: profile,
      };
      
    } catch (error) {
      this.logger.error('Error obteniendo perfil:', error.message);
      throw error;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Req() request: Request) {
    try {
      const user = request.user as any;
      
      return {
        success: true,
        message: 'Usuario autenticado',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      };
      
    } catch (error) {
      this.logger.error('Error verificando autenticación:', error.message);
      throw error;
    }
  }
}
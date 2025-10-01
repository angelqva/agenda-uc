import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Res, 
  Req, 
  UseGuards, 
  HttpStatus, 
  Logger,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { LoginDto, UserProfile } from './auth.dto';
import { LoginDtoSchema } from './auth.dto';
import { AUTH_CONFIG } from './auth.config';
import { ZodValidationPipe } from './zod-validation.pipe';

@Controller('auth/ldap')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDtoSchema))
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const clientIp = this.getClientIp(req);
      
      this.logger.log(`Intento de login para usuario: ${loginDto.username} desde IP: ${clientIp}`);

      const { response, token } = await this.authService.ldapLogin(loginDto, clientIp);

      // Configurar cookie segura con el JWT
      res.cookie(AUTH_CONFIG.COOKIE_NAME, token, AUTH_CONFIG.COOKIE_CONFIG);

      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      this.logger.error(`Error en login: ${error.message}`);
      
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error interno del servidor',
      });
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const user = (req as any).user as UserProfile;
      const clientIp = this.getClientIp(req);

      this.logger.log(`Logout para usuario: ${user.id} desde IP: ${clientIp}`);

      const result = await this.authService.ldapLogout(user.id, clientIp);

      // Limpiar cookie
      res.clearCookie(AUTH_CONFIG.COOKIE_NAME, {
        httpOnly: true,
        secure: AUTH_CONFIG.COOKIE_CONFIG.secure,
        sameSite: AUTH_CONFIG.COOKIE_CONFIG.sameSite,
        path: AUTH_CONFIG.COOKIE_CONFIG.path,
      });

      return res.status(HttpStatus.OK).json(result);

    } catch (error) {
      this.logger.error(`Error en logout: ${error.message}`);
      
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error interno del servidor',
      });
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request): Promise<UserProfile> {
    const user = (req as any).user as UserProfile;
    
    this.logger.log(`Solicitud de perfil para usuario: ${user.id}`);
    
    // El usuario ya fue validado y cargado por el guard
    return user;
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Req() req: Request) {
    const user = (req as any).user as UserProfile;
    
    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  /**
   * Extraer IP del cliente considerando proxies
   */
  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma.service';
import { AUTH_CONFIG } from './auth.config';

@Module({
  imports: [
    JwtModule.register({
      secret: AUTH_CONFIG.JWT_SECRET,
      signOptions: { 
        expiresIn: AUTH_CONFIG.JWT_EXPIRE_TIME,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, PrismaService],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
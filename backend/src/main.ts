import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefix global para todas las rutas
  app.setGlobalPrefix('api');
  
  // Configurar middleware de cookies
  app.use(cookieParser());
  
  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Configurar CORS de forma segura
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Permitir cookies en CORS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Puerto configurable desde variable de entorno
  const port = process.env.PORT || process.env.BACKEND_PORT || 4000;
  
  await app.listen(port);
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📡 API disponible en http://localhost:${port}/api`);
}
bootstrap();

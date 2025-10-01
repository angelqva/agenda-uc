import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar middleware de cookies
  app.use(cookieParser());
  
  // Configurar CORS para desarrollo
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Ajustar según tus frontends
    credentials: true, // Permitir cookies en CORS
  });

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar middleware de cookies
  app.use(cookieParser());
  
  // Configurar CORS para desarrollo
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ], 
    credentials: true, // Permitir cookies en CORS
  });

  // Puerto configurable desde variable de entorno
  const port = process.env.PORT || process.env.BACKEND_PORT || 4000;
  
  await app.listen(port);
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
}
bootstrap();

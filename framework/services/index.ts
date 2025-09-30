// Barrel exports para servicios de autenticación
export { authOptions } from './auth/authOptions';
export { AuthService } from './auth/authService';

// Barrel exports para servicios de base de datos
export { prisma } from './database/prismaClient';
export { DatabaseService } from './database/databaseService';

// Barrel exports para servicios de dominio
export { UsuarioService } from './domain/usuarioService';

// TODO: Exports futuros para otros servicios de dominio
// export { ReservaService } from './domain/reservaService';
// export { OrdenService } from './domain/ordenService';
// export { NotificationService } from './domain/notificationService';
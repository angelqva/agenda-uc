import { prisma } from "./prismaClient";

/**
 * Servicio base para operaciones de base de datos
 * Proporciona métodos comunes para interactuar con Prisma
 */
export class DatabaseService {
  /**
   * Obtiene la instancia de Prisma Client
   * @returns Instancia de PrismaClient
   */
  static getPrismaClient() {
    return prisma;
  }

  /**
   * Verifica la conexión a la base de datos
   * @returns Promise que resuelve si la conexión es exitosa
   */
  static async checkConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Error de conexión a la base de datos:", error);
      return false;
    }
  }

  /**
   * Cierra la conexión a la base de datos
   */
  static async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}
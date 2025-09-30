import { PrismaClient } from "@prisma/client";

/**
 * Configuración global de Prisma Client
 * Evita múltiples instancias en desarrollo
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
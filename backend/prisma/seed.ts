import { PrismaClient } from '@prisma/client';
import { tiposAseguramiento, sedes, tiposActividades } from '../config';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================
  // SEDES
  // ============================

  for (const sede of sedes) {
    await prisma.sede.upsert({
      where: { nombre: sede.nombre },
      update: {},
      create: sede,
    });
  }
  console.log('✅ Sedes insertadas');

  // ============================
  // TIPOS DE ACTIVIDADES / EVENTOS
  // ============================  

  for (const tipo of tiposActividades) {
    await prisma.tipoActividad.upsert({
      where: { nombre: tipo.nombre },
      update: {},
      create: tipo,
    });
  }
  console.log('✅ Tipos de actividades insertados');

  // ============================
  // TIPOS DE ASEGURAMIENTOS
  // ============================
  
  for (const tipo of tiposAseguramiento) {
    await prisma.tipoAseguramiento.upsert({
      where: { nombre: tipo.nombre },
      update: {},
      create: tipo,
    });
  }
  console.log('✅ Tipos de aseguramientos insertados');

  console.log('🌱 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

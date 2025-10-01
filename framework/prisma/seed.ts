import { PrismaClient } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================
  // SEDES
  // ============================
  const sedes = [
    {
      id: createId(),
      nombre: 'Sede Ignacio Agramonte',
      ubicacion:
        'https://www.google.com/maps/place/Universidad+de+Camag%C3%BCey/@21.388154,-77.8853612,17z',
    },
    {
      id: createId(),
      nombre: 'Sede José Martí',
      ubicacion:
        'https://www.google.com/maps/place/Universidad+de+Ciencias+Pedag%C3%B3gicas+Jos%C3%A9+Mart%C3%AD/@21.391133,-77.8857808,16.75z',
    },
    {
      id: createId(),
      nombre: 'Sede Manuel Fajardo',
      ubicacion: 'https://www.google.com/maps/@21.3712123,-77.8787979,17.08z',
    },
  ];

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
  const tiposActividades = [
    { id: createId(), nombre: 'Reunión', icono: 'solar:users-group-rounded-bold' },
    { id: createId(), nombre: 'Conferencia', icono: 'solar:mic-bold' },
    { id: createId(), nombre: 'Clase', icono: 'solar:book-2-bold' },
    { id: createId(), nombre: 'Evento cultural', icono: 'solar:gallery-bold' },
    { id: createId(), nombre: 'Taller', icono: 'solar:pen-bold' },
    { id: createId(), nombre: 'Seminario', icono: 'solar:document-bold' },
    { id: createId(), nombre: 'Defensa de tesis', icono: 'solar:graduation-cap-bold' },
    { id: createId(), nombre: 'Actividad deportiva', icono: 'solar:medal-ribbons-star-bold' },
    { id: createId(), nombre: 'Competencia académica', icono: 'solar:trophy-bold' },
    { id: createId(), nombre: 'Festival estudiantil', icono: 'solar:music-note-2-bold' },
    { id: createId(), nombre: 'Exposición científica', icono: 'solar:atom-bold' },
    { id: createId(), nombre: 'Feria de empleo', icono: 'solar:briefcase-bold' },
    { id: createId(), nombre: 'Encuentro internacional', icono: 'solar:globe-bold' },
    { id: createId(), nombre: 'Curso de posgrado', icono: 'solar:book-bold' },
    { id: createId(), nombre: 'Simposio', icono: 'solar:clipboard-bold' },
    { id: createId(), nombre: 'Actividad política', icono: 'solar:flag-bold' },
    { id: createId(), nombre: 'Círculo de estudios', icono: 'solar:bookmark-square-bold' },
  ];

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
  const tiposAseguramiento = [
    { id: createId(), nombre: 'Alojamiento', icono: 'solar:bed-bold', descripcion: 'Hospedaje para participantes' },
    { id: createId(), nombre: 'Desayuno', icono: 'solar:cup-hot-bold', descripcion: 'Desayuno para los asistentes' },
    { id: createId(), nombre: 'Merienda del día', icono: 'solar:donut-bold', descripcion: 'Merienda en la mañana' },
    { id: createId(), nombre: 'Almuerzo', icono: 'solar:chef-hat-bold', descripcion: 'Almuerzo principal' },
    { id: createId(), nombre: 'Merienda de la tarde', icono: 'solar:candy-bold', descripcion: 'Merienda en la tarde' },
    { id: createId(), nombre: 'Comida', icono: 'solar:dish-bold', descripcion: 'Comida ligera' },
    { id: createId(), nombre: 'Cena', icono: 'solar:cloche-bold', descripcion: 'Cena completa' },
  ];

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

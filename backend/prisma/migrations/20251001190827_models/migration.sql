-- CreateEnum
CREATE TYPE "RolBase" AS ENUM ('RECTOR', 'DIRECTIVO_INSTITUCIONAL', 'DIRECTIVO', 'ALMACENERO', 'RESPONSABLE_LOCAL', 'RESPONSABLE_MEDIO', 'ADMINISTRADOR', 'LOGISTICO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('CREADO', 'REVISADA', 'APROBADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('CREADO', 'REVISADA', 'APROBADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO', 'REENVIADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "usuarioId" TEXT NOT NULL,
    "rol" "RolBase" NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("usuarioId","rol")
);

-- CreateTable
CREATE TABLE "sedes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,

    CONSTRAINT "sedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sede_areas" (
    "sedeId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "sede_areas_pkey" PRIMARY KEY ("sedeId","areaId")
);

-- CreateTable
CREATE TABLE "locales" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "areaId" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,

    CONSTRAINT "locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "localId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "medios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsables_local" (
    "usuarioId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,

    CONSTRAINT "responsables_local_pkey" PRIMARY KEY ("usuarioId","localId")
);

-- CreateTable
CREATE TABLE "responsables_medio" (
    "usuarioId" TEXT NOT NULL,
    "medioId" TEXT NOT NULL,

    CONSTRAINT "responsables_medio_pkey" PRIMARY KEY ("usuarioId","medioId")
);

-- CreateTable
CREATE TABLE "directivos_area" (
    "usuarioId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "directivos_area_pkey" PRIMARY KEY ("usuarioId","areaId")
);

-- CreateTable
CREATE TABLE "administradores_area" (
    "usuarioId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "administradores_area_pkey" PRIMARY KEY ("usuarioId","areaId")
);

-- CreateTable
CREATE TABLE "tipos_actividad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "creadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipoId" TEXT NOT NULL,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "creadorId" TEXT NOT NULL,
    "actividadId" TEXT,
    "localId" TEXT,
    "medioId" TEXT,
    "eventoReferenciaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "participantes" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'CREADO',
    "solicitanteId" TEXT NOT NULL,
    "presideId" TEXT,
    "localId" TEXT,
    "medioId" TEXT,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_eventos_publicos" (
    "id" TEXT NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "solicitanteId" TEXT NOT NULL,
    "revisorId" TEXT,
    "eventoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_eventos_publicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_aseguramiento" (
    "id" TEXT NOT NULL,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'CREADO',
    "creadorId" TEXT NOT NULL,
    "revisorId" TEXT,
    "modificadorId" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventoId" TEXT NOT NULL,

    CONSTRAINT "ordenes_aseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aseguramientos" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "detalles" TEXT,
    "ordenId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,

    CONSTRAINT "aseguramientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_aseguramiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_aseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "accion" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "estadoEnvio" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "destinatarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazas_generales" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "rol" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trazas_generales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazas_reservas" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "actorId" TEXT,
    "accion" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trazas_reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazas_ordenes_aseguramiento" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "actorId" TEXT,
    "accion" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trazas_ordenes_aseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sedes_nombre_key" ON "sedes"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "areas_codigo_key" ON "areas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "locales_codigo_key" ON "locales"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "medios_codigo_key" ON "medios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_actividad_nombre_key" ON "tipos_actividad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_eventoId_key" ON "reservas"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_eventos_publicos_eventoId_key" ON "solicitudes_eventos_publicos"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_aseguramiento_nombre_key" ON "tipos_aseguramiento"("nombre");

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sede_areas" ADD CONSTRAINT "sede_areas_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "sedes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sede_areas" ADD CONSTRAINT "sede_areas_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locales" ADD CONSTRAINT "locales_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locales" ADD CONSTRAINT "locales_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "sedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medios" ADD CONSTRAINT "medios_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medios" ADD CONSTRAINT "medios_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_local" ADD CONSTRAINT "responsables_local_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_local" ADD CONSTRAINT "responsables_local_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_medio" ADD CONSTRAINT "responsables_medio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsables_medio" ADD CONSTRAINT "responsables_medio_medioId_fkey" FOREIGN KEY ("medioId") REFERENCES "medios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directivos_area" ADD CONSTRAINT "directivos_area_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directivos_area" ADD CONSTRAINT "directivos_area_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administradores_area" ADD CONSTRAINT "administradores_area_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administradores_area" ADD CONSTRAINT "administradores_area_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos_actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_medioId_fkey" FOREIGN KEY ("medioId") REFERENCES "medios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_eventoReferenciaId_fkey" FOREIGN KEY ("eventoReferenciaId") REFERENCES "eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_presideId_fkey" FOREIGN KEY ("presideId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_medioId_fkey" FOREIGN KEY ("medioId") REFERENCES "medios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_eventos_publicos" ADD CONSTRAINT "solicitudes_eventos_publicos_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_eventos_publicos" ADD CONSTRAINT "solicitudes_eventos_publicos_revisorId_fkey" FOREIGN KEY ("revisorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_eventos_publicos" ADD CONSTRAINT "solicitudes_eventos_publicos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_aseguramiento" ADD CONSTRAINT "ordenes_aseguramiento_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_aseguramiento" ADD CONSTRAINT "ordenes_aseguramiento_revisorId_fkey" FOREIGN KEY ("revisorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_aseguramiento" ADD CONSTRAINT "ordenes_aseguramiento_modificadorId_fkey" FOREIGN KEY ("modificadorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_aseguramiento" ADD CONSTRAINT "ordenes_aseguramiento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aseguramientos" ADD CONSTRAINT "aseguramientos_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_aseguramiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aseguramientos" ADD CONSTRAINT "aseguramientos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos_aseguramiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_generales" ADD CONSTRAINT "trazas_generales_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_reservas" ADD CONSTRAINT "trazas_reservas_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_reservas" ADD CONSTRAINT "trazas_reservas_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_ordenes_aseguramiento" ADD CONSTRAINT "trazas_ordenes_aseguramiento_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_aseguramiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_ordenes_aseguramiento" ADD CONSTRAINT "trazas_ordenes_aseguramiento_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "public"."RolBase" AS ENUM ('ADMINISTRADOR', 'LOGISTICO', 'RECTOR', 'DIRECTIVO_INSTITUCIONAL');

-- CreateEnum
CREATE TYPE "public"."EstadoReserva" AS ENUM ('CREADO', 'REVISADA', 'APROBADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."EstadoSolicitud" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "public"."EstadoOrden" AS ENUM ('CREADO', 'REVISADA', 'APROBADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."EstadoEnvio" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO', 'REENVIADO');

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT,
    "biografia" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsuarioRol" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "public"."RolBase" NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sede" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "directivos" TEXT[],
    "almaceneros" TEXT[],

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SedeArea" (
    "sedeId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "SedeArea_pkey" PRIMARY KEY ("sedeId","areaId")
);

-- CreateTable
CREATE TABLE "public"."Local" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "responsables" TEXT[],
    "areaId" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medio" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "responsables" TEXT[],
    "localId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "Medio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TipoActividad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Actividad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "creadorEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipoId" TEXT NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "creadorEmail" TEXT NOT NULL,
    "actividadId" TEXT,
    "localId" TEXT,
    "medioId" TEXT,
    "eventoReferenciaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reserva" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "participantes" INTEGER NOT NULL,
    "estado" "public"."EstadoReserva" NOT NULL DEFAULT 'CREADO',
    "solicitanteEmail" TEXT NOT NULL,
    "preside" TEXT,
    "localId" TEXT,
    "medioId" TEXT,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolicitudEventoPublico" (
    "id" TEXT NOT NULL,
    "estado" "public"."EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "solicitanteEmail" TEXT NOT NULL,
    "revisorEmail" TEXT,
    "eventoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudEventoPublico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrdenAseguramiento" (
    "id" TEXT NOT NULL,
    "estado" "public"."EstadoOrden" NOT NULL DEFAULT 'CREADO',
    "creadorEmail" TEXT NOT NULL,
    "revisorEmail" TEXT,
    "modificadorEmail" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventoId" TEXT NOT NULL,

    CONSTRAINT "OrdenAseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Aseguramiento" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "detalles" TEXT,
    "ordenId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,

    CONSTRAINT "Aseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TipoAseguramiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoAseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notificacion" (
    "id" TEXT NOT NULL,
    "destinatarioEmail" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "accion" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "estadoEnvio" "public"."EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrazaGeneral" (
    "id" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrazaGeneral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrazaReserva" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrazaReserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrazaOrdenAseguramiento" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrazaOrdenAseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_nombre_key" ON "public"."Sede"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Area_codigo_key" ON "public"."Area"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Local_codigo_key" ON "public"."Local"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Medio_codigo_key" ON "public"."Medio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_eventoId_key" ON "public"."Reserva"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudEventoPublico_eventoId_key" ON "public"."SolicitudEventoPublico"("eventoId");

-- AddForeignKey
ALTER TABLE "public"."SedeArea" ADD CONSTRAINT "SedeArea_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "public"."Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SedeArea" ADD CONSTRAINT "SedeArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Local" ADD CONSTRAINT "Local_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Local" ADD CONSTRAINT "Local_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "public"."Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medio" ADD CONSTRAINT "Medio_localId_fkey" FOREIGN KEY ("localId") REFERENCES "public"."Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medio" ADD CONSTRAINT "Medio_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "public"."TipoActividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "public"."Actividad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_localId_fkey" FOREIGN KEY ("localId") REFERENCES "public"."Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_medioId_fkey" FOREIGN KEY ("medioId") REFERENCES "public"."Medio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_eventoReferenciaId_fkey" FOREIGN KEY ("eventoReferenciaId") REFERENCES "public"."Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_localId_fkey" FOREIGN KEY ("localId") REFERENCES "public"."Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_medioId_fkey" FOREIGN KEY ("medioId") REFERENCES "public"."Medio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolicitudEventoPublico" ADD CONSTRAINT "SolicitudEventoPublico_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenAseguramiento" ADD CONSTRAINT "OrdenAseguramiento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aseguramiento" ADD CONSTRAINT "Aseguramiento_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "public"."OrdenAseguramiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aseguramiento" ADD CONSTRAINT "Aseguramiento_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "public"."TipoAseguramiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrazaReserva" ADD CONSTRAINT "TrazaReserva_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "public"."Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrazaOrdenAseguramiento" ADD CONSTRAINT "TrazaOrdenAseguramiento_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "public"."OrdenAseguramiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

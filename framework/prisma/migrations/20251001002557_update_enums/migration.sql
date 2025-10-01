/*
  Warnings:

  - You are about to drop the `Notificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SolicitudEventoPublico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoAseguramiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioRol` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Aseguramiento" DROP CONSTRAINT "Aseguramiento_tipoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_eventoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_localId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_medioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SolicitudEventoPublico" DROP CONSTRAINT "SolicitudEventoPublico_eventoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrazaReserva" DROP CONSTRAINT "TrazaReserva_reservaId_fkey";

-- DropTable
DROP TABLE "public"."Notificacion";

-- DropTable
DROP TABLE "public"."Reserva";

-- DropTable
DROP TABLE "public"."SolicitudEventoPublico";

-- DropTable
DROP TABLE "public"."TipoAseguramiento";

-- DropTable
DROP TABLE "public"."Usuario";

-- DropTable
DROP TABLE "public"."UsuarioRol";

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imageUrl" TEXT,
    "biografia" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuario_roles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "public"."RolBase" NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservas" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "participantes" INTEGER NOT NULL,
    "estado" "public"."EstadoReserva" NOT NULL DEFAULT 'CREADO',
    "solicitanteEmail" TEXT NOT NULL,
    "preside" TEXT,
    "localId" TEXT,
    "medioId" TEXT,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solicitudes_evento_publico" (
    "id" TEXT NOT NULL,
    "estado" "public"."EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "solicitanteEmail" TEXT NOT NULL,
    "revisorEmail" TEXT,
    "eventoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_evento_publico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipos_aseguramiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_aseguramiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notificaciones" (
    "id" TEXT NOT NULL,
    "destinatarioEmail" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "accion" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "estadoEnvio" "public"."EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_eventoId_key" ON "public"."reservas"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_evento_publico_eventoId_key" ON "public"."solicitudes_evento_publico"("eventoId");

-- AddForeignKey
ALTER TABLE "public"."reservas" ADD CONSTRAINT "reservas_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservas" ADD CONSTRAINT "reservas_localId_fkey" FOREIGN KEY ("localId") REFERENCES "public"."Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservas" ADD CONSTRAINT "reservas_medioId_fkey" FOREIGN KEY ("medioId") REFERENCES "public"."Medio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitudes_evento_publico" ADD CONSTRAINT "solicitudes_evento_publico_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aseguramiento" ADD CONSTRAINT "Aseguramiento_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "public"."tipos_aseguramiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrazaReserva" ADD CONSTRAINT "TrazaReserva_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "public"."reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

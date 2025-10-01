/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `TipoActividad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `tipos_aseguramiento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TipoActividad_nombre_key" ON "public"."TipoActividad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_aseguramiento_nombre_key" ON "public"."tipos_aseguramiento"("nombre");

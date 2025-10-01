/*
  Warnings:

  - The values [USER] on the enum `RolBase` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RolBase_new" AS ENUM ('RECTOR', 'DIRECTIVO_INSTITUCIONAL', 'DIRECTIVO', 'ALMACENERO', 'RESPONSABLE_LOCAL', 'RESPONSABLE_MEDIO', 'ADMINISTRADOR', 'LOGISTICO', 'USUARIO');
ALTER TABLE "usuario_roles" ALTER COLUMN "rol" TYPE "RolBase_new" USING ("rol"::text::"RolBase_new");
ALTER TYPE "RolBase" RENAME TO "RolBase_old";
ALTER TYPE "RolBase_new" RENAME TO "RolBase";
DROP TYPE "public"."RolBase_old";
COMMIT;

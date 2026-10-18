/*
  Warnings:

  - You are about to drop the column `newStatus` on the `Status_History` table. All the data in the column will be lost.
  - You are about to drop the column `previousStatus` on the `Status_History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Status_History` DROP COLUMN `newStatus`,
    DROP COLUMN `previousStatus`,
    ADD COLUMN `status` ENUM('recibido', 'diagnostico', 'presupuestado', 'aprobado', 'reparacion', 'listo', 'entregado', 'cancelado') NOT NULL DEFAULT 'recibido';

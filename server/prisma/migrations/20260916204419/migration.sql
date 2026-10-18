/*
  Warnings:

  - The values [respuesto] on the enum `AddedCost_type_addedCost` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `AddedCost` MODIFY `type_addedCost` ENUM('repuesto', 'procedimientoEspecial', 'garantia', 'reparacionExpress', 'limpiezaPuestaAPunto', 'serviciosSoftware') NOT NULL;

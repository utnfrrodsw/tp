/*
  Warnings:

  - You are about to drop the column `id_equipment` on the `failure` table. All the data in the column will be lost.
  - Added the required column `id_order` to the `Failure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Failure` DROP FOREIGN KEY `Failure_id_equipment_fkey`;

-- DropIndex
DROP INDEX `Failure_id_equipment_fkey` ON `Failure`;

-- AlterTable
ALTER TABLE `Failure` DROP COLUMN `id_equipment`,
    ADD COLUMN `id_order` CHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `Failure` ADD CONSTRAINT `Failure_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `Order`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

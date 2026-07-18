/*
  Warnings:

  - You are about to alter the column `amountForCategoryUp` on the `category_client` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `discountRate` on the `payment_type` table. All the data in the column will be lost.
  - You are about to drop the column `surchargeRate` on the `payment_type` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentTypeName]` on the table `Payment_Type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentTypeName` to the `Payment_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_of_payment` to the `Payment_Type` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Payment_Type_paymentMethod_key` ON `payment_type`;

-- AlterTable
ALTER TABLE `category_client` MODIFY `amountForCategoryUp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment_type` DROP COLUMN `discountRate`,
    DROP COLUMN `surchargeRate`,
    ADD COLUMN `paymentTypeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `percentaje` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `type_of_payment` ENUM('Descuento', 'Recargo') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_Type_paymentTypeName_key` ON `Payment_Type`(`paymentTypeName`);

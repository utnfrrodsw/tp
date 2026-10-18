/*
  Warnings:

  - A unique constraint covering the columns `[nroBudget]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nroOrder]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nroBudget` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nroOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Budget` ADD COLUMN `nroBudget` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `nroOrder` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Budget_nroBudget_key` ON `Budget`(`nroBudget`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_nroOrder_key` ON `Order`(`nroOrder`);

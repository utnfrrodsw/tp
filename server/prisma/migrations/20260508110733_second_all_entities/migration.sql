/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Client` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `clientName` VARCHAR(191) NOT NULL,
    `clientEmail` VARCHAR(191) NOT NULL,
    `clientPhone` VARCHAR(191) NOT NULL,
    `dniCuit` VARCHAR(191) NOT NULL,
    `dateOfRegistration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` BOOLEAN NOT NULL DEFAULT true,
    `id_category_client` INTEGER NOT NULL,

    UNIQUE INDEX `Client_clientName_key`(`clientName`),
    UNIQUE INDEX `Client_clientEmail_key`(`clientEmail`),
    UNIQUE INDEX `Client_dniCuit_key`(`dniCuit`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category_Client` (
    `id_category_client` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryClientName` VARCHAR(191) NOT NULL,
    `amountForCategoryUp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_Client_categoryClientName_key`(`categoryClientName`),
    PRIMARY KEY (`id_category_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Failure_Type` (
    `id_failure_type` INTEGER NOT NULL AUTO_INCREMENT,
    `failureDescription` VARCHAR(191) NOT NULL,
    `estimatedImport` DOUBLE NOT NULL,

    UNIQUE INDEX `Failure_Type_failureDescription_key`(`failureDescription`),
    PRIMARY KEY (`id_failure_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Failure` (
    `id_failure` INTEGER NOT NULL AUTO_INCREMENT,
    `id_failure_type` INTEGER NOT NULL,
    `id_equipment` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `dateOfFailure` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('resuelta', 'diagnosticada') NOT NULL DEFAULT 'diagnosticada',

    PRIMARY KEY (`id_failure`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment` (
    `id_equipment` INTEGER NOT NULL AUTO_INCREMENT,
    `equipmentName` VARCHAR(191) NOT NULL,
    `tipo_equipment` ENUM('celular', 'computadora', 'tablet', 'consola', 'otro') NOT NULL,
    `observations` VARCHAR(191) NOT NULL,
    `id_client` INTEGER NOT NULL,

    UNIQUE INDEX `Equipment_equipmentName_key`(`equipmentName`),
    PRIMARY KEY (`id_equipment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id_order` INTEGER NOT NULL AUTO_INCREMENT,
    `id_equipment` INTEGER NOT NULL,
    `id_user` INTEGER NULL,
    `status` ENUM('recibido', 'diagnostico', 'presupuestado', 'aprobado', 'reparacion', 'listo', 'entregado', 'cancelado') NOT NULL DEFAULT 'recibido',
    `failureReported` VARCHAR(191) NOT NULL,
    `technicianDiagnosis` VARCHAR(191) NULL,
    `dateOfEntry` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estimatedDate` DATETIME(3) NULL,
    `deliveryDate` DATETIME(3) NULL,
    `totalCharged` DOUBLE NULL,

    PRIMARY KEY (`id_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Status_History` (
    `id_status_history` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `previousStatus` VARCHAR(191) NOT NULL,
    `newStatus` VARCHAR(191) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `dateOfChange` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comment` VARCHAR(191) NULL,

    PRIMARY KEY (`id_status_history`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Budget` (
    `id_budget` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `laborCost` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `estimatedTotal` DOUBLE NOT NULL,
    `status` ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',

    UNIQUE INDEX `Budget_id_order_key`(`id_order`),
    PRIMARY KEY (`id_budget`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment_Type` (
    `id_payment_type` INTEGER NOT NULL AUTO_INCREMENT,
    `discountRate` DOUBLE NOT NULL DEFAULT 0,
    `surchargeRate` DOUBLE NOT NULL DEFAULT 0,
    `paymentMethod` ENUM('DEBITO', 'MP', 'EFECTIVO', 'CREDITO') NOT NULL,

    UNIQUE INDEX `Payment_Type_paymentMethod_key`(`paymentMethod`),
    PRIMARY KEY (`id_payment_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id_payment` INTEGER NOT NULL AUTO_INCREMENT,
    `id_payment_type` INTEGER NOT NULL,
    `id_budget` INTEGER NOT NULL,
    `dateOfPayment` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` DOUBLE NOT NULL,

    PRIMARY KEY (`id_payment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_userName_key` ON `User`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_category_client_fkey` FOREIGN KEY (`id_category_client`) REFERENCES `Category_Client`(`id_category_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Failure` ADD CONSTRAINT `Failure_id_failure_type_fkey` FOREIGN KEY (`id_failure_type`) REFERENCES `Failure_Type`(`id_failure_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Failure` ADD CONSTRAINT `Failure_id_equipment_fkey` FOREIGN KEY (`id_equipment`) REFERENCES `Equipment`(`id_equipment`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_equipment_fkey` FOREIGN KEY (`id_equipment`) REFERENCES `Equipment`(`id_equipment`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Status_History` ADD CONSTRAINT `Status_History_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `Order`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Status_History` ADD CONSTRAINT `Status_History_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `Order`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_id_payment_type_fkey` FOREIGN KEY (`id_payment_type`) REFERENCES `Payment_Type`(`id_payment_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_id_budget_fkey` FOREIGN KEY (`id_budget`) REFERENCES `Budget`(`id_budget`) ON DELETE RESTRICT ON UPDATE CASCADE;

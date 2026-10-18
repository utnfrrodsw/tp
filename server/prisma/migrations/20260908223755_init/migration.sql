-- CreateTable
CREATE TABLE `User` (
    `id_user` CHAR(36) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `rol` ENUM('admin', 'tecnico') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `validationStatus` BOOLEAN NOT NULL DEFAULT false,
    `urlPicture` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/dcgvogduy/image/upload/v1778239413/taller-mecanico/j4fv1vtqqrhskyw0owms.png',

    UNIQUE INDEX `User_userName_key`(`userName`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id_client` CHAR(36) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `clientEmail` VARCHAR(191) NOT NULL,
    `clientPhone` VARCHAR(191) NOT NULL,
    `cuit` VARCHAR(191) NOT NULL,
    `dateOfRegistration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` BOOLEAN NOT NULL DEFAULT true,
    `id_client_type` CHAR(36) NOT NULL,

    UNIQUE INDEX `Client_clientEmail_key`(`clientEmail`),
    UNIQUE INDEX `Client_cuit_key`(`cuit`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client_Type` (
    `id_client_type` CHAR(36) NOT NULL,
    `clientTypeName` VARCHAR(191) NOT NULL,
    `amountForCategoryUp` INTEGER NOT NULL,

    UNIQUE INDEX `Client_Type_clientTypeName_key`(`clientTypeName`),
    PRIMARY KEY (`id_client_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Failure_Type` (
    `id_failure_type` CHAR(36) NOT NULL,
    `failureDescription` VARCHAR(191) NOT NULL,
    `estimatedImport` DECIMAL(12, 2) NOT NULL,

    UNIQUE INDEX `Failure_Type_failureDescription_key`(`failureDescription`),
    PRIMARY KEY (`id_failure_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Failure` (
    `id_failure` CHAR(36) NOT NULL,
    `id_failure_type` CHAR(36) NOT NULL,
    `id_equipment` CHAR(36) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `dateOfFailure` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('resuelta', 'diagnosticada') NOT NULL DEFAULT 'diagnosticada',

    PRIMARY KEY (`id_failure`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment` (
    `id_equipment` CHAR(36) NOT NULL,
    `tipo_equipment` ENUM('celular', 'computadora', 'tablet', 'consola', 'notebook', 'impresora', 'televisor', 'otro') NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `observations` VARCHAR(191) NULL,
    `id_client` CHAR(36) NOT NULL,

    PRIMARY KEY (`id_equipment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id_order` CHAR(36) NOT NULL,
    `id_equipment` CHAR(36) NOT NULL,
    `id_user` CHAR(36) NULL,
    `status` ENUM('recibido', 'diagnostico', 'presupuestado', 'aprobado', 'reparacion', 'listo', 'entregado', 'cancelado') NOT NULL DEFAULT 'recibido',
    `observations` VARCHAR(191) NULL,
    `equipmentPhotoUrl` VARCHAR(191) NULL,
    `dateOfEntry` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estimatedDate` DATETIME(3) NULL,
    `deliveryDate` DATETIME(3) NULL,
    `totalCharged` DECIMAL(12, 2) NULL,

    PRIMARY KEY (`id_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Status_History` (
    `id_status_history` CHAR(36) NOT NULL,
    `id_order` CHAR(36) NOT NULL,
    `previousStatus` VARCHAR(191) NOT NULL,
    `newStatus` VARCHAR(191) NOT NULL,
    `id_user` CHAR(36) NOT NULL,
    `dateOfChange` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comment` VARCHAR(191) NULL,

    PRIMARY KEY (`id_status_history`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Budget` (
    `id_budget` CHAR(36) NOT NULL,
    `id_order` CHAR(36) NOT NULL,
    `laborCost` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `estimatedTotal` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',

    UNIQUE INDEX `Budget_id_order_key`(`id_order`),
    PRIMARY KEY (`id_budget`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment_Type` (
    `id_payment_type` CHAR(36) NOT NULL,
    `paymentTypeName` VARCHAR(191) NOT NULL,
    `paymentMethod` ENUM('DEBITO', 'MP', 'EFECTIVO', 'CREDITO') NOT NULL,
    `type_of_payment` ENUM('Descuento', 'Recargo') NOT NULL,
    `percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0,

    UNIQUE INDEX `Payment_Type_paymentTypeName_key`(`paymentTypeName`),
    PRIMARY KEY (`id_payment_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id_payment` CHAR(36) NOT NULL,
    `id_payment_type` CHAR(36) NOT NULL,
    `id_budget` CHAR(36) NOT NULL,
    `dateOfPayment` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`id_payment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_client_type_fkey` FOREIGN KEY (`id_client_type`) REFERENCES `Client_Type`(`id_client_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

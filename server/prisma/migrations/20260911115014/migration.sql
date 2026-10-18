-- CreateTable
CREATE TABLE `AddedCost` (
    `id_addedCost` CHAR(36) NOT NULL,
    `id_budget` CHAR(36) NOT NULL,
    `type_addedCost` ENUM('respuesto', 'procedimientoEspecial', 'garantia', 'reparacionExpress', 'limpiezaPuestaAPunto', 'serviciosSoftware') NOT NULL,
    `addedCostDescription` VARCHAR(191) NOT NULL,
    `addedCostAmount` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`id_addedCost`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AddedCost` ADD CONSTRAINT `AddedCost_id_budget_fkey` FOREIGN KEY (`id_budget`) REFERENCES `Budget`(`id_budget`) ON DELETE RESTRICT ON UPDATE CASCADE;

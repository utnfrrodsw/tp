/*
  Warnings:

  - Made the column `urlPicture` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `urlPicture` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/dcgvogduy/image/upload/v1778239413/taller-mecanico/j4fv1vtqqrhskyw0owms.png';

-- Agrega el atributo "draft" (borrador) a la tabla servicios
-- Ejecutar en MySQL Workbench sobre la base "planit"

ALTER TABLE servicios
  ADD COLUMN draft TINYINT(1) NOT NULL DEFAULT 1;

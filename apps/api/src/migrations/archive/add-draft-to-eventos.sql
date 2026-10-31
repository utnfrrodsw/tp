-- Agrega el atributo "draft" (borrador) a la tabla eventos
-- Ejecutar en MySQL Workbench sobre la base "planit"

ALTER TABLE eventos
  ADD COLUMN draft TINYINT(1) NOT NULL DEFAULT 1;

-- Agrega los atributos exclusivos de empresa a la tabla usuarios
-- Ejecutar en MySQL Workbench sobre la base "planit"

ALTER TABLE usuarios
  ADD COLUMN zona VARCHAR(100) NULL,
  ADD COLUMN cuit INT NULL,
  ADD COLUMN telefono INT NULL;

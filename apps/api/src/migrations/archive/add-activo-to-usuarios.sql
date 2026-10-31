-- Agrega el atributo "activo" a la tabla usuarios (para poder suspender cuentas, ej. empresas)
-- Ejecutar en MySQL Workbench sobre la base "planit"

ALTER TABLE usuarios
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1;

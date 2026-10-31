  -- Reemplaza el campo booleano "draft" de servicios por un estado de publicacion
  -- con 3 valores posibles: 'borrador', 'revision' y 'publicado'.
  -- Ahora cuando una empresa quiere publicar un servicio no se publica solo,
  -- pasa a "revision" y un administrador lo tiene que aprobar o denegar.
  -- Ejecutar en el SQL Editor de Supabase.

  -- 1) Agrego la columna nueva con un valor por defecto
  ALTER TABLE servicios
    ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'borrador';

  -- 2) Migro los datos que ya existian: lo que estaba publicado (draft = false)
  -- lo dejo directamente como "publicado" para no obligar a las empresas a
  -- volver a pedir aprobacion de todo lo que ya tenian activo.
  UPDATE servicios SET estado = 'publicado' WHERE draft = FALSE;
  UPDATE servicios SET estado = 'borrador'  WHERE draft = TRUE;

  -- 3) Agrego la restriccion para que el estado solo pueda ser uno de los 3 valores
  ALTER TABLE servicios
    ADD CONSTRAINT chk_servicios_estado CHECK (estado IN ('borrador', 'revision', 'publicado'));

  -- 4) Borro el indice y la columna vieja, ya no se usan mas
  DROP INDEX IF EXISTS idx_servicios_draft;
  ALTER TABLE servicios DROP COLUMN IF EXISTS draft;

  -- 5) Creo el indice para el estado nuevo
  CREATE INDEX IF NOT EXISTS idx_servicios_estado ON servicios (estado);

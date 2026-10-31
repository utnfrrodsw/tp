-- Aplicar en MySQL sobre planit, después de create-evento-categoria-and-tableros.sql.
ALTER TABLE tableros
  ADD COLUMN evento_id INT NULL,
  ADD CONSTRAINT fk_tableros_evento
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
    ON DELETE SET NULL;
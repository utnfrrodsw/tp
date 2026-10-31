-- Crea la tabla intermedia tablero_servicio (servicios que un cliente guardó en un tablero)
-- Ejecutar en MySQL Workbench sobre la base "planit"

CREATE TABLE tablero_servicio (
  tablero_id INT NOT NULL,
  servicio_id INT NOT NULL,
  guardado_en DATETIME NULL,
  PRIMARY KEY (tablero_id, servicio_id),
  CONSTRAINT fk_tablero_servicio_tablero
    FOREIGN KEY (tablero_id) REFERENCES tableros(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_tablero_servicio_servicio
    FOREIGN KEY (servicio_id) REFERENCES servicios(id)
    ON DELETE CASCADE
);

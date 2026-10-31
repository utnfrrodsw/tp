-- Crea la tabla intermedia evento_categoria (relación N:M entre eventos y categorias)
-- Ejecutar en MySQL Workbench sobre la base "planit"

CREATE TABLE evento_categoria (
  evento_id INT NOT NULL,
  categoria_id INT NOT NULL,
  PRIMARY KEY (evento_id, categoria_id),
  CONSTRAINT fk_evento_categoria_evento
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_evento_categoria_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE CASCADE
);

-- Crea la tabla tableros (uno o varios tableros por cliente)

CREATE TABLE tableros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  fecha_creacion DATETIME NOT NULL,
  CONSTRAINT fk_tableros_cliente
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

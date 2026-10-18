create database taller_mecanico;
use taller_mecanico;
 
 CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'tecnico') NOT NULL DEFAULT 'tecnico',
    activo BOOLEAN DEFAULT FALSE
);
 
 INSERT INTO Usuario (nombre_usuario, email, password_hash, rol, activo) 
VALUES 
('Tomas Admin', 'admin@taller.com', '1234', 'admin', FALSE),
('Juan Tecnico', 'juan.t@taller.com', '1234', 'tecnico', FALSE),
('Pedro Tecnico', 'pedro.t@taller.com', '1234', 'tecnico', FALSE);
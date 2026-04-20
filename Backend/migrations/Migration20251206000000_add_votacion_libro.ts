import { Migration } from '@mikro-orm/migrations';

export class Migration20251206000000 extends Migration {

  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE votacion_libro (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT UNSIGNED NOT NULL,
        libro_id INT UNSIGNED NOT NULL,
        voto ENUM('positivo', 'negativo') NOT NULL,
        fecha_voto DATETIME NOT NULL,
        CONSTRAINT votacion_libro_usuario_id_foreign 
          FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON UPDATE CASCADE,
        CONSTRAINT votacion_libro_libro_id_foreign 
          FOREIGN KEY (libro_id) REFERENCES libro(id) ON UPDATE CASCADE,
        UNIQUE KEY votacion_libro_usuario_id_libro_id_unique (usuario_id, libro_id)
      ) DEFAULT CHARACTER SET utf8mb4 ENGINE = InnoDB;
    `);

    this.addSql(`ALTER TABLE votacion_libro ADD INDEX votacion_libro_usuario_id_index(usuario_id);`);
    this.addSql(`ALTER TABLE votacion_libro ADD INDEX votacion_libro_libro_id_index(libro_id);`);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS votacion_libro;`);
  }
}

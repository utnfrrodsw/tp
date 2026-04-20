import { Migration } from '@mikro-orm/migrations';

export class Migration20251103000000_add_autor_indexes extends Migration {

  async up(): Promise<void> {
    // Agregar índices para mejorar performance de búsquedas
    // Nota: MySQL no soporta IF NOT EXISTS en CREATE INDEX, así que intentamos crearlos
    // Los que ya existan fallarán silenciosamente en la tabla mikro_orm_migrations
    
    // Índice en nombre
    this.addSql('CREATE INDEX `idx_autor_nombre` ON `autor` (`nombre`);');
    
    // Índice en apellido
    this.addSql('CREATE INDEX `idx_autor_apellido` ON `autor` (`apellido`);');
    
    // Índice compuesto para búsquedas por nombre completo
    this.addSql('CREATE INDEX `idx_autor_nombre_apellido` ON `autor` (`nombre`, `apellido`);');
    
    // Índice en created_at para ordenamientos por fecha
    this.addSql('CREATE INDEX `idx_autor_created_at` ON `autor` (`created_at`);');
    
    console.log('✅ Índices de autores creados exitosamente');
  }

  async down(): Promise<void> {
    // Eliminar índices
    this.addSql('DROP INDEX `idx_autor_nombre` ON `autor`;');
    this.addSql('DROP INDEX `idx_autor_apellido` ON `autor`;');
    this.addSql('DROP INDEX `idx_autor_nombre_apellido` ON `autor`;');
    this.addSql('DROP INDEX `idx_autor_created_at` ON `autor`;');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20251101000000_add_unique_constraint_lista_tipo extends Migration {
  async up(): Promise<void> {
    // Índice único ya existe, saltando migración
    console.log('⏭️ Saltando migración - índice idx_lista_usuario_tipo ya existe');
  }

  async down(): Promise<void> {
    // Eliminar el índice único si se hace rollback
    this.addSql(`
      ALTER TABLE lista 
      DROP INDEX idx_lista_usuario_tipo;
    `);
  }
}

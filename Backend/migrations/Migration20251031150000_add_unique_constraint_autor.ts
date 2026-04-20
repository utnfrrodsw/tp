import { Migration } from '@mikro-orm/migrations';

export class Migration20251031150000_add_unique_constraint_autor extends Migration {
  async up(): Promise<void> {
    // Índice único ya existe, saltando migración
    console.log('⏭️ Saltando migración - índice único autor_nombre_apellido_unique ya existe');
  }

  async down(): Promise<void> {
    // Revertir: eliminar el índice único
    this.addSql('ALTER TABLE `autor` DROP INDEX `autor_nombre_apellido_unique`;');
  }
}

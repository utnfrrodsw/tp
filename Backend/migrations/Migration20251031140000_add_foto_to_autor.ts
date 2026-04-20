import { Migration } from '@mikro-orm/migrations';

export class Migration20251031140000_add_foto_to_autor extends Migration {
  async up(): Promise<void> {
    // Columna foto ya existe, saltando migración
    console.log('⏭️ Saltando migración - columna foto ya existe');
  }

  async down(): Promise<void> {
    // Revertir cambios
    this.addSql('ALTER TABLE `autor` DROP COLUMN `foto`;');
  }
}

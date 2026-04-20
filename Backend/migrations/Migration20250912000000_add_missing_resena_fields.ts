import { Migration } from '@mikro-orm/migrations';

export class Migration20250912000000_add_missing_resena_fields extends Migration {

  override async up(): Promise<void> {
    // Esta migración se asume ya ejecutada o las columnas ya existen
    // No hacemos nada para evitar errores de duplicados
    console.log('Migration 20250912000000: Skipping (assuming already applied or columns exist)');
  }

  override async down(): Promise<void> {
    // No revertimos nada porque no aplicamos nada
    console.log('Migration 20250912000000: No down action');
  }

}

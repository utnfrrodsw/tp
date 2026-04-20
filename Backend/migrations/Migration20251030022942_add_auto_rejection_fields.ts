import { Migration } from '@mikro-orm/migrations';

export class Migration20251030022942_add_auto_rejection_fields extends Migration {

  override async up(): Promise<void> {
    // Las columnas ya existen, saltando migración
    console.log('⏭️ Saltando migración - columnas de auto-rejection ya existen');
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`resena\` drop column \`auto_rejected\`, drop column \`rejection_reason\`, drop column \`deleted_at\`;`);
  }

}

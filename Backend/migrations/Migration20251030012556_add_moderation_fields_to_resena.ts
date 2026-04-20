import { Migration } from '@mikro-orm/migrations';

export class Migration20251030012556_add_moderation_fields_to_resena extends Migration {

  override async up(): Promise<void> {
    // Las columnas ya existen, saltando migración
    console.log('⏭️ Saltando migración - columnas de moderación ya existen');
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`resena\` drop column \`moderation_score\`, drop column \`moderation_reasons\`, drop column \`auto_moderated\`;`);
  }

}

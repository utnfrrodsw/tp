import { Migration } from '@mikro-orm/migrations';

export class Migration20251103194440_add_external_ids_to_autor extends Migration {

  override async up(): Promise<void> {
    // Columnas e índices ya existen, saltando migración
    console.log('⏭️ Saltando migración - columnas de external IDs ya existen');
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`autor\` drop index \`autor_google_books_id_index\`;`);
    this.addSql(`alter table \`autor\` drop index \`autor_google_books_id_unique\`;`);
    this.addSql(`alter table \`autor\` drop index \`autor_open_library_key_index\`;`);
    this.addSql(`alter table \`autor\` drop index \`autor_open_library_key_unique\`;`);
    this.addSql(`alter table \`autor\` drop index \`autor_nombre_apellido_unique\`;`);
    this.addSql(`alter table \`autor\` drop column \`foto\`, drop column \`google_books_id\`, drop column \`open_library_key\`, drop column \`biografia\`;`);

    this.addSql(`alter table \`libro\` drop index \`libro_slug_index\`;`);
    this.addSql(`alter table \`libro\` drop column \`slug\`;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20251030145005_add_orden_to_contenido_lista extends Migration {

  override async up(): Promise<void> {
    // La columna orden ya existe, saltando migración
    console.log('⏭️ Saltando migración - columna orden ya existe');
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`contenido_lista\` drop column \`orden\`;`);
  }

}

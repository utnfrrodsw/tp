import { Migration } from '@mikro-orm/migrations';

export class Migration20251031021933_add_slug_to_libro extends Migration {

  override async up(): Promise<void> {
    // Columna slug ya existe, saltando migración
    console.log('⏭️ Saltando migración - columna slug y su índice ya existen');
  }

  override async down(): Promise<void> {
    // Eliminar índice
    this.addSql(`drop index \`libro_slug_index\` on \`libro\`;`);
    
    // Eliminar campo slug
    this.addSql(`alter table \`libro\` drop \`slug\`;`);
    
    this.addSql(`alter table \`resena\` modify \`estado\` enum('pending', 'approved', 'flagged') not null default 'pending';`);
  }

}

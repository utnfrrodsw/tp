import { Migration } from '@mikro-orm/migrations';

export class Migration20260127150000_add_respuesta_tipo_actividad extends Migration {

  override async up(): Promise<void> {
    // Modificar el tipo de la columna para incluir 'respuesta'
    this.addSql(`alter table \`actividad\` modify \`tipo\` enum('resena', 'respuesta', 'favorito', 'seguimiento', 'lista', 'reaccion') not null;`);
  }

  override async down(): Promise<void> {
    // Revertir al enum original sin 'respuesta'
    this.addSql(`alter table \`actividad\` modify \`tipo\` enum('resena', 'favorito', 'seguimiento', 'lista', 'reaccion') not null;`);
  }

}

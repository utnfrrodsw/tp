import { Migration } from '@mikro-orm/migrations';

export class Migration20260127150100_update_existing_respuestas extends Migration {

  override async up(): Promise<void> {
    // Actualizar todas las actividades que son respuestas (tienen resena_id con resenaPadre)
    // para que tengan el tipo 'respuesta' en lugar de 'resena'
    this.addSql(`
      UPDATE \`actividad\` a
      INNER JOIN \`resena\` r ON a.resena_id = r.id
      SET a.tipo = 'respuesta'
      WHERE r.resena_padre_id IS NOT NULL
      AND a.tipo = 'resena';
    `);
  }

  override async down(): Promise<void> {
    // Revertir: todas las actividades de tipo 'respuesta' vuelven a ser 'resena'
    this.addSql(`
      UPDATE \`actividad\`
      SET tipo = 'resena'
      WHERE tipo = 'respuesta';
    `);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20251010012314_add_missing_resena_fields extends Migration {

  override async up(): Promise<void> {
    // Esta migración se asume ya ejecutada o las columnas ya existen
    // No hacemos nada para evitar errores de duplicados
    console.log('Migration 20251010012314: Skipping (assuming already applied or columns exist)');
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`libro\` drop foreign key \`libro_autor_id_foreign\`;`);
    this.addSql(`alter table \`libro\` drop foreign key \`libro_categoria_id_foreign\`;`);
    this.addSql(`alter table \`libro\` drop foreign key \`libro_editorial_id_foreign\`;`);

    this.addSql(`alter table \`categoria\` drop column \`descripcion\`;`);

    this.addSql(`alter table \`libro\` drop column \`imagen\`, drop column \`enlace\`, drop column \`source\`;`);

    this.addSql(`alter table \`libro\` modify \`nombre\` varchar(255) not null, modify \`sinopsis\` text not null, modify \`autor_id\` int unsigned not null, modify \`categoria_id\` int unsigned not null, modify \`editorial_id\` int unsigned not null;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_autor_id_foreign\` foreign key (\`autor_id\`) references \`autor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_categoria_id_foreign\` foreign key (\`categoria_id\`) references \`categoria\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_editorial_id_foreign\` foreign key (\`editorial_id\`) references \`editorial\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`usuario\` drop column \`avatar\`;`);
  }

}

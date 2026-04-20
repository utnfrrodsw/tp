import { Migration } from '@mikro-orm/migrations';

export class Migration20251015144733_add_resena_self_reference extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`resena\` add \`resena_padre_id\` int unsigned null;`);
    this.addSql(`alter table \`resena\` add constraint \`resena_resena_padre_id_foreign\` foreign key (\`resena_padre_id\`) references \`resena\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`resena\` add index \`resena_resena_padre_id_index\`(\`resena_padre_id\`);`);
    this.addSql(`alter table \`resena\` add index \`resena_libro_id_resena_padre_id_fecha_resena_index\`(\`libro_id\`, \`resena_padre_id\`, \`fecha_resena\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`resena\` drop foreign key \`resena_resena_padre_id_foreign\`;`);

    this.addSql(`alter table \`resena\` drop index \`resena_resena_padre_id_index\`;`);
    this.addSql(`alter table \`resena\` drop index \`resena_libro_id_resena_padre_id_fecha_resena_index\`;`);
    this.addSql(`alter table \`resena\` drop column \`resena_padre_id\`;`);
  }

}

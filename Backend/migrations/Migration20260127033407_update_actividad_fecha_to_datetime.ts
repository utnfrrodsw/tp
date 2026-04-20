import { Migration } from '@mikro-orm/migrations';

export class Migration20260127033407_update_actividad_fecha_to_datetime extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`actividad\` modify \`fecha\` datetime not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`actividad\` modify \`fecha\` date not null;`);
  }

}

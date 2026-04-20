import { Migration } from '@mikro-orm/migrations';

export class Migration20250911152317_add_profile_fields extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`usuario\` add \`nombre\` varchar(255) null, add \`biografia\` varchar(255) null, add \`ubicacion\` varchar(255) null, add \`genero\` varchar(20) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`usuario\` drop column \`nombre\`, drop column \`biografia\`, drop column \`ubicacion\`, drop column \`genero\`;`);
  }

}

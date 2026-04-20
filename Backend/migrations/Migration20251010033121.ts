import { Migration } from '@mikro-orm/migrations';

export class Migration20251010033121 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`libro\` add \`external_id\` varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`libro\` drop column \`external_id\`;`);
  }

}

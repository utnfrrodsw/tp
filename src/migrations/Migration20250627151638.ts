import { Migration } from '@mikro-orm/migrations';

export class Migration20250627151638 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`saga\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`alter table \`libro\` add \`saga_id\` int unsigned null;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_saga_id_foreign\` foreign key (\`saga_id\`) references \`saga\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`libro\` add index \`libro_saga_id_index\`(\`saga_id\`);`);

    this.addSql(`alter table \`usuario\` add \`rol\` varchar(20) not null default 'usuario';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`libro\` drop foreign key \`libro_saga_id_foreign\`;`);

    this.addSql(`drop table if exists \`saga\`;`);

    this.addSql(`alter table \`libro\` drop index \`libro_saga_id_index\`;`);
    this.addSql(`alter table \`libro\` drop column \`saga_id\`;`);

    this.addSql(`alter table \`usuario\` drop column \`rol\`;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20251206213554 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists \`newsletter\` (\`id\` int unsigned not null auto_increment primary key, \`email\` varchar(255) not null, \`nombre\` varchar(255) null, \`fecha_suscripcion\` datetime not null, \`activo\` tinyint(1) not null default true, \`fecha_baja\` datetime null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table if not exists \`password_reset_token\` (\`id\` int unsigned not null auto_increment primary key, \`usuario_id\` int unsigned not null, \`token\` varchar(255) not null, \`fecha_creacion\` datetime not null, \`fecha_expiracion\` datetime not null, \`usado\` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;`);
    
    // Check if index exists before adding
    const indexExists = await this.execute(`
      SELECT COUNT(1) as cnt 
      FROM information_schema.statistics 
      WHERE table_schema = DATABASE() 
      AND table_name = 'password_reset_token' 
      AND index_name = 'password_reset_token_usuario_id_index'
    `);
    
    if (indexExists[0].cnt === 0) {
      this.addSql(`alter table \`password_reset_token\` add index \`password_reset_token_usuario_id_index\`(\`usuario_id\`);`);
    }

    // Check if foreign key exists before adding
    const fkExists = await this.execute(`
      SELECT COUNT(1) as cnt 
      FROM information_schema.table_constraints 
      WHERE table_schema = DATABASE() 
      AND table_name = 'password_reset_token' 
      AND constraint_name = 'password_reset_token_usuario_id_foreign'
    `);
    
    if (fkExists[0].cnt === 0) {
      this.addSql(`alter table \`password_reset_token\` add constraint \`password_reset_token_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);
    }
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`newsletter\`;`);

    this.addSql(`drop table if exists \`password_reset_token\`;`);
  }

}

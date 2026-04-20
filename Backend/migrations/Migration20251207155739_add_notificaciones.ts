import { Migration } from '@mikro-orm/migrations';

export class Migration20251207155739_add_notificaciones extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`notificacion\` (\`id\` int unsigned not null auto_increment primary key, \`usuario_id\` int unsigned not null, \`tipo\` enum('NUEVA_RESENA', 'NUEVA_REACCION', 'NUEVO_SEGUIDOR', 'ACTIVIDAD_SEGUIDO', 'RESPUESTA_RESENA', 'LIBRO_FAVORITO') not null, \`mensaje\` varchar(255) not null, \`leida\` tinyint(1) not null default false, \`data\` json null, \`created_at\` datetime not null, \`url\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`notificacion\` add index \`notificacion_usuario_id_index\`(\`usuario_id\`);`);

    this.addSql(`alter table \`notificacion\` add constraint \`notificacion_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`notificacion\`;`);
  }

}

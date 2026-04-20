import { Migration } from '@mikro-orm/migrations';

export class Migration20250903174205_add_missing_entities extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`permiso\` (\`id\` int unsigned not null auto_increment primary key, \`tipo\` enum('moderar_resena', 'eliminar_usuario', 'gestionar_libro') not null, \`descripcion\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`rating_libro\` (\`id\` int unsigned not null auto_increment primary key, \`libro_id\` int unsigned not null, \`avg_rating\` float not null, \`cantidad_resenas\` int not null, \`fecha_actualizacion\` date not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`rating_libro\` add index \`rating_libro_libro_id_index\`(\`libro_id\`);`);

    this.addSql(`create table \`actividad\` (\`id\` int unsigned not null auto_increment primary key, \`usuario_id\` int unsigned not null, \`tipo\` enum('resena', 'favorito', 'seguimiento', 'lista', 'reaccion') not null, \`libro_id\` int unsigned null, \`resena_id\` int unsigned null, \`fecha\` date not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`actividad\` add index \`actividad_usuario_id_index\`(\`usuario_id\`);`);
    this.addSql(`alter table \`actividad\` add index \`actividad_libro_id_index\`(\`libro_id\`);`);
    this.addSql(`alter table \`actividad\` add index \`actividad_resena_id_index\`(\`resena_id\`);`);

    this.addSql(`alter table \`rating_libro\` add constraint \`rating_libro_libro_id_foreign\` foreign key (\`libro_id\`) references \`libro\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`actividad\` add constraint \`actividad_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`actividad\` add constraint \`actividad_libro_id_foreign\` foreign key (\`libro_id\`) references \`libro\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`actividad\` add constraint \`actividad_resena_id_foreign\` foreign key (\`resena_id\`) references \`resena\` (\`id\`) on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`permiso\`;`);

    this.addSql(`drop table if exists \`rating_libro\`;`);

    this.addSql(`drop table if exists \`actividad\`;`);
  }

}

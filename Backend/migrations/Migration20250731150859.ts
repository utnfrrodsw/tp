import { Migration } from '@mikro-orm/migrations';

export class Migration20250731150859 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`autor\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null, \`apellido\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`categoria\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`editorial\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`saga\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`usuario\` (\`id\` int unsigned not null auto_increment primary key, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`username\` varchar(255) not null, \`rol\` varchar(20) not null default 'usuario', \`refresh_token\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`seguimiento\` (\`id\` int unsigned not null auto_increment primary key, \`seguidor_id\` int unsigned not null, \`seguido_id\` int unsigned not null, \`fecha_seguido\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`seguimiento\` add index \`seguimiento_seguidor_id_index\`(\`seguidor_id\`);`);
    this.addSql(`alter table \`seguimiento\` add index \`seguimiento_seguido_id_index\`(\`seguido_id\`);`);

    this.addSql(`create table \`lista\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null, \`ultima_modificacion\` datetime not null, \`usuario_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`lista\` add index \`lista_usuario_id_index\`(\`usuario_id\`);`);

    this.addSql(`create table \`libro\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(255) not null, \`sinopsis\` varchar(255) not null, \`autor_id\` int unsigned not null, \`categoria_id\` int unsigned not null, \`editorial_id\` int unsigned not null, \`saga_id\` int unsigned null, \`lista_id\` int unsigned null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`libro\` add index \`libro_autor_id_index\`(\`autor_id\`);`);
    this.addSql(`alter table \`libro\` add index \`libro_categoria_id_index\`(\`categoria_id\`);`);
    this.addSql(`alter table \`libro\` add index \`libro_editorial_id_index\`(\`editorial_id\`);`);
    this.addSql(`alter table \`libro\` add index \`libro_saga_id_index\`(\`saga_id\`);`);
    this.addSql(`alter table \`libro\` add index \`libro_lista_id_index\`(\`lista_id\`);`);

    this.addSql(`create table \`resena\` (\`id\` int unsigned not null auto_increment primary key, \`comentario\` varchar(255) not null, \`estrellas\` int not null, \`fecha_resena\` datetime not null, \`usuario_id\` int unsigned not null, \`libro_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`resena\` add index \`resena_usuario_id_index\`(\`usuario_id\`);`);
    this.addSql(`alter table \`resena\` add index \`resena_libro_id_index\`(\`libro_id\`);`);

    this.addSql(`create table \`reaccion\` (\`id\` int unsigned not null auto_increment primary key, \`tipo\` varchar(255) not null, \`usuario_id\` int unsigned not null, \`resena_id\` int unsigned not null, \`fecha\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`reaccion\` add index \`reaccion_usuario_id_index\`(\`usuario_id\`);`);
    this.addSql(`alter table \`reaccion\` add index \`reaccion_resena_id_index\`(\`resena_id\`);`);

    this.addSql(`create table \`contenido_lista\` (\`id\` int unsigned not null auto_increment primary key, \`lista_id\` int unsigned not null, \`libro_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`contenido_lista\` add index \`contenido_lista_lista_id_index\`(\`lista_id\`);`);
    this.addSql(`alter table \`contenido_lista\` add index \`contenido_lista_libro_id_index\`(\`libro_id\`);`);

    this.addSql(`create table \`favorito\` (\`id\` int unsigned not null auto_increment primary key, \`usuario_id\` int unsigned not null, \`libro_id\` int unsigned not null, \`fecha_agregado\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`favorito\` add index \`favorito_usuario_id_index\`(\`usuario_id\`);`);
    this.addSql(`alter table \`favorito\` add index \`favorito_libro_id_index\`(\`libro_id\`);`);

    this.addSql(`alter table \`seguimiento\` add constraint \`seguimiento_seguidor_id_foreign\` foreign key (\`seguidor_id\`) references \`usuario\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`seguimiento\` add constraint \`seguimiento_seguido_id_foreign\` foreign key (\`seguido_id\`) references \`usuario\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`lista\` add constraint \`lista_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`libro\` add constraint \`libro_autor_id_foreign\` foreign key (\`autor_id\`) references \`autor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_categoria_id_foreign\` foreign key (\`categoria_id\`) references \`categoria\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_editorial_id_foreign\` foreign key (\`editorial_id\`) references \`editorial\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_saga_id_foreign\` foreign key (\`saga_id\`) references \`saga\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_lista_id_foreign\` foreign key (\`lista_id\`) references \`lista\` (\`id\`) on update cascade on delete set null;`);

    this.addSql(`alter table \`resena\` add constraint \`resena_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`resena\` add constraint \`resena_libro_id_foreign\` foreign key (\`libro_id\`) references \`libro\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`reaccion\` add constraint \`reaccion_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`reaccion\` add constraint \`reaccion_resena_id_foreign\` foreign key (\`resena_id\`) references \`resena\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`contenido_lista\` add constraint \`contenido_lista_lista_id_foreign\` foreign key (\`lista_id\`) references \`lista\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`contenido_lista\` add constraint \`contenido_lista_libro_id_foreign\` foreign key (\`libro_id\`) references \`libro\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`favorito\` add constraint \`favorito_usuario_id_foreign\` foreign key (\`usuario_id\`) references \`usuario\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`favorito\` add constraint \`favorito_libro_id_foreign\` foreign key (\`libro_id\`) references \`libro\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`libro\` drop foreign key \`libro_autor_id_foreign\`;`);

    this.addSql(`alter table \`libro\` drop foreign key \`libro_categoria_id_foreign\`;`);

    this.addSql(`alter table \`libro\` drop foreign key \`libro_editorial_id_foreign\`;`);

    this.addSql(`alter table \`libro\` drop foreign key \`libro_saga_id_foreign\`;`);

    this.addSql(`alter table \`seguimiento\` drop foreign key \`seguimiento_seguidor_id_foreign\`;`);

    this.addSql(`alter table \`seguimiento\` drop foreign key \`seguimiento_seguido_id_foreign\`;`);

    this.addSql(`alter table \`lista\` drop foreign key \`lista_usuario_id_foreign\`;`);

    this.addSql(`alter table \`resena\` drop foreign key \`resena_usuario_id_foreign\`;`);

    this.addSql(`alter table \`reaccion\` drop foreign key \`reaccion_usuario_id_foreign\`;`);

    this.addSql(`alter table \`favorito\` drop foreign key \`favorito_usuario_id_foreign\`;`);

    this.addSql(`alter table \`libro\` drop foreign key \`libro_lista_id_foreign\`;`);

    this.addSql(`alter table \`contenido_lista\` drop foreign key \`contenido_lista_lista_id_foreign\`;`);

    this.addSql(`alter table \`resena\` drop foreign key \`resena_libro_id_foreign\`;`);

    this.addSql(`alter table \`contenido_lista\` drop foreign key \`contenido_lista_libro_id_foreign\`;`);

    this.addSql(`alter table \`favorito\` drop foreign key \`favorito_libro_id_foreign\`;`);

    this.addSql(`alter table \`reaccion\` drop foreign key \`reaccion_resena_id_foreign\`;`);

    this.addSql(`drop table if exists \`autor\`;`);

    this.addSql(`drop table if exists \`categoria\`;`);

    this.addSql(`drop table if exists \`editorial\`;`);

    this.addSql(`drop table if exists \`saga\`;`);

    this.addSql(`drop table if exists \`usuario\`;`);

    this.addSql(`drop table if exists \`seguimiento\`;`);

    this.addSql(`drop table if exists \`lista\`;`);

    this.addSql(`drop table if exists \`libro\`;`);

    this.addSql(`drop table if exists \`resena\`;`);

    this.addSql(`drop table if exists \`reaccion\`;`);

    this.addSql(`drop table if exists \`contenido_lista\`;`);

    this.addSql(`drop table if exists \`favorito\`;`);
  }

}

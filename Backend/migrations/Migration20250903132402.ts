import { Migration } from '@mikro-orm/migrations';

export class Migration20250903132402 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`libro\` drop foreign key \`libro_lista_id_foreign\`;`);

    this.addSql(`alter table \`autor\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`autor\` add index \`autor_nombre_index\`(\`nombre\`);`);
    this.addSql(`alter table \`autor\` add index \`autor_apellido_index\`(\`apellido\`);`);

    this.addSql(`alter table \`categoria\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`categoria\` add index \`categoria_nombre_index\`(\`nombre\`);`);
    this.addSql(`alter table \`categoria\` add unique \`categoria_nombre_unique\`(\`nombre\`);`);

    this.addSql(`alter table \`editorial\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`editorial\` add unique \`editorial_nombre_unique\`(\`nombre\`);`);

    this.addSql(`alter table \`saga\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`saga\` add unique \`saga_nombre_unique\`(\`nombre\`);`);

    this.addSql(`alter table \`libro\` drop index \`libro_lista_id_index\`;`);
    this.addSql(`alter table \`libro\` drop column \`lista_id\`;`);

    this.addSql(`alter table \`libro\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`libro\` modify \`sinopsis\` text not null;`);
    this.addSql(`alter table \`libro\` add index \`libro_nombre_index\`(\`nombre\`);`);

    this.addSql(`alter table \`usuario\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`usuario\` add index \`usuario_email_index\`(\`email\`);`);
    this.addSql(`alter table \`usuario\` add index \`usuario_username_index\`(\`username\`);`);
    this.addSql(`alter table \`usuario\` add unique \`usuario_username_unique\`(\`username\`);`);
    this.addSql(`alter table \`usuario\` add unique \`usuario_email_unique\`(\`email\`);`);

    this.addSql(`alter table \`seguimiento\` add \`updated_at\` date null;`);
    this.addSql(`alter table \`seguimiento\` modify \`fecha_seguido\` date not null;`);
    this.addSql(`alter table \`seguimiento\` add unique \`seguimiento_seguidor_id_seguido_id_unique\`(\`seguidor_id\`, \`seguido_id\`);`);

    this.addSql(`alter table \`resena\` add \`estado\` enum('pending', 'approved', 'flagged') not null default 'pending', add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`resena\` modify \`comentario\` text not null, modify \`fecha_resena\` date not null;`);

    this.addSql(`alter table \`reaccion\` add \`updated_at\` date null;`);
    this.addSql(`alter table \`reaccion\` modify \`tipo\` enum('like', 'dislike', 'corazon') not null, modify \`fecha\` date not null;`);
    this.addSql(`alter table \`reaccion\` add unique \`reaccion_usuario_id_resena_id_unique\`(\`usuario_id\`, \`resena_id\`);`);

    this.addSql(`alter table \`lista\` add \`tipo\` enum('read', 'to_read', 'pending', 'custom') not null default 'custom', add \`created_at\` date not null;`);
    this.addSql(`alter table \`lista\` modify \`ultima_modificacion\` date not null;`);

    this.addSql(`alter table \`contenido_lista\` add \`created_at\` date not null, add \`updated_at\` date null;`);
    this.addSql(`alter table \`contenido_lista\` add unique \`contenido_lista_lista_id_libro_id_unique\`(\`lista_id\`, \`libro_id\`);`);

    this.addSql(`alter table \`favorito\` add \`updated_at\` date null;`);
    this.addSql(`alter table \`favorito\` modify \`fecha_agregado\` date not null;`);
    this.addSql(`alter table \`favorito\` add unique \`favorito_usuario_id_libro_id_unique\`(\`usuario_id\`, \`libro_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`autor\` drop index \`autor_nombre_index\`;`);
    this.addSql(`alter table \`autor\` drop index \`autor_apellido_index\`;`);
    this.addSql(`alter table \`autor\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`categoria\` drop index \`categoria_nombre_index\`;`);
    this.addSql(`alter table \`categoria\` drop index \`categoria_nombre_unique\`;`);
    this.addSql(`alter table \`categoria\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`editorial\` drop index \`editorial_nombre_unique\`;`);
    this.addSql(`alter table \`editorial\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`saga\` drop index \`saga_nombre_unique\`;`);
    this.addSql(`alter table \`saga\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`usuario\` drop index \`usuario_email_index\`;`);
    this.addSql(`alter table \`usuario\` drop index \`usuario_username_index\`;`);
    this.addSql(`alter table \`usuario\` drop index \`usuario_username_unique\`;`);
    this.addSql(`alter table \`usuario\` drop index \`usuario_email_unique\`;`);
    this.addSql(`alter table \`usuario\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`seguimiento\` drop index \`seguimiento_seguidor_id_seguido_id_unique\`;`);
    this.addSql(`alter table \`seguimiento\` drop column \`updated_at\`;`);

    this.addSql(`alter table \`seguimiento\` modify \`fecha_seguido\` datetime not null;`);

    this.addSql(`alter table \`lista\` drop column \`tipo\`, drop column \`created_at\`;`);

    this.addSql(`alter table \`lista\` modify \`ultima_modificacion\` datetime not null;`);

    this.addSql(`alter table \`libro\` drop index \`libro_nombre_index\`;`);
    this.addSql(`alter table \`libro\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`libro\` add \`lista_id\` int unsigned null;`);
    this.addSql(`alter table \`libro\` modify \`sinopsis\` varchar(255) not null;`);
    this.addSql(`alter table \`libro\` add constraint \`libro_lista_id_foreign\` foreign key (\`lista_id\`) references \`lista\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`libro\` add index \`libro_lista_id_index\`(\`lista_id\`);`);

    this.addSql(`alter table \`resena\` drop column \`estado\`, drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`resena\` modify \`comentario\` varchar(255) not null, modify \`fecha_resena\` datetime not null;`);

    this.addSql(`alter table \`reaccion\` drop index \`reaccion_usuario_id_resena_id_unique\`;`);
    this.addSql(`alter table \`reaccion\` drop column \`updated_at\`;`);

    this.addSql(`alter table \`reaccion\` modify \`tipo\` varchar(255) not null, modify \`fecha\` datetime not null;`);

    this.addSql(`alter table \`contenido_lista\` drop index \`contenido_lista_lista_id_libro_id_unique\`;`);
    this.addSql(`alter table \`contenido_lista\` drop column \`created_at\`, drop column \`updated_at\`;`);

    this.addSql(`alter table \`favorito\` drop index \`favorito_usuario_id_libro_id_unique\`;`);
    this.addSql(`alter table \`favorito\` drop column \`updated_at\`;`);

    this.addSql(`alter table \`favorito\` modify \`fecha_agregado\` datetime not null;`);
  }

}

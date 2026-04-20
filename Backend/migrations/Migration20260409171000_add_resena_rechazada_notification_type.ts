import { Migration } from '@mikro-orm/migrations';

export class Migration20260409171000_add_resena_rechazada_notification_type extends Migration {

  override async up(): Promise<void> {
    this.addSql("alter table `notificacion` modify `tipo` enum('NUEVA_RESENA', 'NUEVA_REACCION', 'NUEVO_SEGUIDOR', 'ACTIVIDAD_SEGUIDO', 'RESPUESTA_RESENA', 'LIBRO_FAVORITO', 'RESENA_RECHAZADA') not null;");
  }

  override async down(): Promise<void> {
    this.addSql("alter table `notificacion` modify `tipo` enum('NUEVA_RESENA', 'NUEVA_REACCION', 'NUEVO_SEGUIDOR', 'ACTIVIDAD_SEGUIDO', 'RESPUESTA_RESENA', 'LIBRO_FAVORITO') not null;");
  }

}

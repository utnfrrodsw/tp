import { Migration } from '@mikro-orm/migrations';

export class Migration20251030000000_clean_saga_data extends Migration {

  async up(): Promise<void> {
    // Primero quitar las referencias de saga en la tabla libro
    this.addSql('update `libro` set `saga_id` = null where `saga_id` is not null;');
    
    // Luego eliminar todas las sagas
    this.addSql('delete from `saga`;');
    
    // Resetear el auto_increment para empezar de cero
    this.addSql('alter table `saga` auto_increment = 1;');
  }

  async down(): Promise<void> {
    // No hay forma de revertir la eliminación de datos
    // Esta migración es irreversible
    this.addSql('-- No es posible revertir la eliminación de datos');
  }

}

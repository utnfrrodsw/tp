// src/seeders/DatabaseSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { UsuarioSeeder } from './Usuario.seeder.js';
import { ZonaSeeder } from './zona.seeder.js';
import { TipoServicioSeeder } from './tipoServicio.seeder.js';
import { TareaSeeder } from './tarea.seeder.js';
import { ServicioSeeder } from './servicio.seeder.js';
import { TurnoSeeder } from './turno.seeder.js';
import { HorarioSeeder } from './horario.seeder.js';
import { PagoSeeder } from './pago.seeder.js';

export class DatabaseSeeder extends Seeder {
  async run(em: any): Promise<void> {
    console.log(
      'Iniciando seeders.....................................................................................................'
    );
    await this.call(em, [
      ZonaSeeder,
      UsuarioSeeder,
      TipoServicioSeeder,
      TareaSeeder,
      ServicioSeeder,
      TurnoSeeder,
      HorarioSeeder,
      PagoSeeder,
    ]);
  }
}

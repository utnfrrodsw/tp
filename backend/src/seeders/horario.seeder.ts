// src/seeders/HorarioSeeder.ts
import { Seeder } from '@mikro-orm/seeder';

import { EntityManager } from '@mikro-orm/core';
import { Horario } from '../horario/horario.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

export class HorarioSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando HorarioSeeder........................................................................................................'
    );
    const prestatarios = await em.find(Usuario, {
      nombreFantasia: { $ne: null },
    });
    for (const prest of prestatarios) {
      // Creamos 6 horarios
      for (let i = 0; i < 6; i++) {
        em.create(Horario, {
          diaSemana: i, // 0 = lunes, 6 = domingo
          horaDesde: '08:00:00',
          horaHasta: '19:00:00',
          usuario: prest, // asignamos el prestatario
        });
      }
      em.create(Horario, {
        diaSemana: 6, // 0 = lunes, 6 = domingo
        horaDesde: '00:00:00',
        horaHasta: '00:00:00',
        usuario: prest, // asignamos el prestatario
      });
    }
    await em.flush();
  }
}

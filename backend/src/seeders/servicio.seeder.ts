// src/seeders/ServicioSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Servicio } from '../servicio/servicio.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Tarea } from '../tarea/tarea.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';
import { faker } from '@faker-js/faker';

export class ServicioSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando ServicioSeeder........................................................................................................'
    );
    // 1. Buscar todos los prestatarios
    const prestatarios = await em.find(Usuario, {
      nombreFantasia: { $ne: null },
    });

    // Obtener todos los tipos de servicio disponibles
    const todosLosTiposServicio = await em.find(TipoServicio, {});

    for (const prest of prestatarios) {
      // 2. Asignar tipos de servicio al prestatario (si no los tiene)
      await em.populate(prest, ['tiposDeServicio']);

      // Si el prestatario no tiene tipos de servicio asignados, asignarle algunos al azar
      if (prest.tiposDeServicio.length === 0) {
        const tiposAsignar = faker.helpers.arrayElements(
          todosLosTiposServicio,
          faker.number.int({ min: 1, max: 3 })
        );
        prest.tiposDeServicio.set(tiposAsignar);
        await em.persistAndFlush(prest);
      }

      // 3. Para cada tipo de servicio del prestatario, crear 3 servicios
      for (const tipoServ of prest.tiposDeServicio.getItems()) {
        // Obtener todas las tareas de este tipo de servicio
        const tareas = await em.find(Tarea, { tipoServicio: tipoServ });

        if (tareas.length > 0) {
          // Crear 3 servicios para este tipo de servicio
          for (let i = 0; i < 3; i++) {
            // Elegir una tarea al azar para cada servicio
            const tareaElegida = faker.helpers.arrayElement(tareas);

            em.create(Servicio, {
              estado: faker.helpers.arrayElement(['activo', 'inactivo']),
              precio: faker.number.int({ min: 500, max: 6400 }),
              tarea: tareaElegida,
              usuario: prest,
            });
          }
        }
      }
    }

    await em.flush();
  }
}

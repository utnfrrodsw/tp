import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Turno } from '../turno/turno.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { faker } from '@faker-js/faker';

export class TurnoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando TurnoSeeder........................................................................................................'
    );
    const clientes = await em.find(Usuario, { nombreFantasia: null }); // usuarios cliente
    const servicios = await em.find(Servicio, { estado: 'activo' }); // servicios activos

    const estadosFuturos = ['pendiente', 'confirmado'];
    const estadosPasados = [
      'completado',
      'cancelado',
      'completado',
      'completado',
      'completado',
    ];

    for (const cliente of clientes) {
      // Cada cliente tiene entre 20 y 30 turnos
      const numTurnos = faker.number.int({ min: 20, max: 35 });
      console.log(`Cliente ${cliente.id} - Creando ${numTurnos} turnos...`);

      for (let i = 0; i < numTurnos; i++) {
        const fechaHora = faker.date.between({
          from: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          to: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        });
        let estado: string;
        if (fechaHora < new Date()) {
          estado = faker.helpers.arrayElement(estadosPasados);
        } else {
          estado = faker.helpers.arrayElement(estadosFuturos);
        }
        // Servicio aleatorio
        const servicio = faker.helpers.arrayElement(servicios);
        let calificacion: number | undefined;
        let comentario: string | undefined;
        if (estado === 'completado') {
          if (i < Math.floor(numTurnos * 0.6)) {
            calificacion = faker.number.int({ min: 1, max: 5 });
            comentario = faker.lorem.sentence();
          }
        }
        const montoFinal = Math.round(servicio.precio * 1.05); // precio + 5%

        em.create(Turno, {
          fechaHora,
          estado,
          usuario: cliente,
          servicio,
          calificacion,
          comentario,
          montoFinal,
        });
      }
    }

    await em.flush();
  }
}

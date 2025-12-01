// src/seeders/PagoSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Pago } from '../pago/pago.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { faker } from '@faker-js/faker';

export class PagoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando PagoSeeder........................................................................................................'
    );
    // Turnos completados con comentario
    const turnos = await em.find(Turno, {
      estado: 'completado',
      comentario: { $ne: null },
    });

    for (const turno of turnos) {
      const estado = faker.helpers.arrayElement([
        'succeeded',
        'succeeded',
        'succeeded',
        'succeeded',
        'processing',
      ]);

      const amount = turno.montoFinal * 100; // monto en centavos
      const amountReceived = Math.round(turno.montoFinal * 0.95 * 100); // 95% en centavos

      em.create(Pago, {
        paymentIntentId: `pi_${faker.string.alphanumeric(24)}`,
        amount,
        currency: 'usd',
        estado,
        sellerStripeId: `acct_${faker.string.alphanumeric(16)}`,
        amountReceived,
        turno,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Turnos completados sin comentario
    const turnosSinComentario = await em.find(Turno, {
      estado: 'completado',
      comentario: null,
    });

    const cantidad = Math.floor(turnosSinComentario.length * 0.6);
    for (let i = 0; i < cantidad; i++) {
      const turno =
        turnosSinComentario[
          Math.floor(Math.random() * turnosSinComentario.length)
        ];
      const estado = faker.helpers.arrayElement([
        'succeeded',
        'succeeded',
        'succeeded',
        'processing',
      ]);
      const amount = turno.montoFinal * 100;
      const amountReceived = Math.round(turno.montoFinal * 0.95 * 100);

      em.create(Pago, {
        paymentIntentId: `pi_${faker.string.alphanumeric(24)}`,
        amount,
        currency: 'usd',
        estado,
        sellerStripeId: `acct_${faker.string.alphanumeric(16)}`,
        amountReceived,
        turno,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await em.flush();
  }
}

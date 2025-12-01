// src/seeders/ZonaSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Zona } from '../zona/zona.entity.js';

export class ZonaSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando ZonaSeeder........................................................................................................'
    );
    em.create(Zona, {
      descripcionZona: 'Norte',
    });
    em.create(Zona, {
      descripcionZona: 'Sur',
    });
    em.create(Zona, {
      descripcionZona: 'Este',
    });
    em.create(Zona, {
      descripcionZona: ' Oeste',
    });
    em.create(Zona, {
      descripcionZona: 'Centro',
    });
    console.log('🔍 ZonaSeeder: Antes de flush()');
    await em.flush();
    console.log('✅ ZonaSeeder: Datos persistidos correctamente');
  }
}

// src/seeders/TipoServicioSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';

export class TipoServicioSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando TipoServicioSeeder........................................................................................................'
    );
    const servicios = [
      {
        nombre: 'Limpieza Residencial',
        descripcion: 'Limpieza general del hogar y oficinas',
      },
      {
        nombre: 'Plomería',
        descripcion: 'Servicios de fontanería e instalaciones',
      },
      {
        nombre: 'Electricidad',
        descripcion: 'Instalaciones y reparaciones eléctricas',
      },
      {
        nombre: 'Jardinería',
        descripcion: 'Mantenimiento de jardines y espacios verdes',
      },
      { nombre: 'Pintura', descripcion: 'Pintura interior y exterior' },
      { nombre: 'Carpintería', descripcion: 'Trabajos en madera y muebles' },
      {
        nombre: 'Construcción',
        descripcion: 'Trabajos de construcción y albañilería',
      },
      {
        nombre: 'Cerrajería',
        descripcion: 'Servicios de seguridad y cerrajería',
      },
      {
        nombre: 'Climatización',
        descripcion: 'Instalación y reparación de aires acondicionados',
      },
      {
        nombre: 'Reparaciones Generales',
        descripcion: 'Reparaciones generales del hogar',
      },
      {
        nombre: 'Servicios Técnicos',
        descripcion: 'Servicios técnicos especializados',
      },
      {
        nombre: 'Servicios del Hogar',
        descripcion: 'Servicios diversos para el hogar',
      },
      {
        nombre: 'Servicios Integrales',
        descripcion: 'Servicios completos e integrales',
      },
      {
        nombre: 'Hogar y Jardín',
        descripcion: 'Servicios combinados de hogar y jardín',
      },
      {
        nombre: 'Limpieza Industrial',
        descripcion: 'Limpieza especializada para industrias',
      },
      {
        nombre: 'Control de Plagas',
        descripcion: 'Control de plagas y fumigación',
      },
      {
        nombre: 'Mantenimiento Integral',
        descripcion: 'Mantenimiento completo de edificios',
      },
      {
        nombre: 'Servicios de Piscinas',
        descripcion: 'Mantenimiento y limpieza de piscinas',
      },
      {
        nombre: 'Decoración Interior',
        descripcion: 'Diseño y decoración de interiores',
      },
      {
        nombre: 'Refrigeración',
        descripcion: 'Servicios de frío y climatización',
      },
      {
        nombre: 'Tecnología y Automatización',
        descripcion: 'Servicios tecnológicos y automatización',
      },
    ];

    let insertados = 0;
    for (const s of servicios) {
      // Verificar si ya existe un tipo de servicio con este nombre
      const existing = await em.findOne(TipoServicio, { nombreTipo: s.nombre });
      if (!existing) {
        em.create(TipoServicio, {
          nombreTipo: s.nombre,
          descripcionTipo: s.descripcion,
        });
        insertados++;
      }
    }

    if (insertados > 0) {
      await em.flush();
      console.log(`Insertados ${insertados} nuevos tipos de servicio.`);
    } else {
      console.log(
        'Todos los tipos de servicio ya existen en la base de datos.'
      );
    }
  }
}

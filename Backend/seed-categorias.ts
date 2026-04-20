import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config';
import { Categoria } from './src/entities/categoria.entity';

const categorias = [
  {
    nombre: 'Fantasy',
    descripcion: 'Narrativas que incluyen magia, criaturas míticas y mundos imaginarios.'
  },
  {
    nombre: 'Fiction',
    descripcion: 'Historias basadas en futuros imaginados, tecnología avanzada y conceptos científicos.'
  },
  {
    nombre: 'Mystery',
    descripcion: 'Relatos de crimen, investigación y tramas que mantienen la intriga hasta el final.'
  },
  {
    nombre: 'Romance',
    descripcion: 'Historias centradas en relaciones amorosas y su desarrollo.'
  },
  {
    nombre: 'Comics & Graphic Novels',
    descripcion: 'Narrativa contada a través de viñetas e ilustraciones, incluyendo manga.'
  },
  {
    nombre: 'History',
    descripcion: 'Libros de no ficción que exploran eventos, épocas y figuras del pasado.'
  },
  {
    nombre: 'Self-Help',
    descripcion: 'Textos enfocados en el desarrollo personal, el bienestar psicológico y la salud.'
  },
  {
    nombre: 'Technology',
    descripcion: 'Guías, manuales y análisis sobre software, programación y tecnología.'
  },
  {
    nombre: 'Cooking',
    descripcion: 'Libros de recetas y textos sobre las artes culinarias y la gastronomía.'
  },
  {
    nombre: 'Economics',
    descripcion: 'Libros sobre finanzas, gestión, emprendimiento y teoría económica.'
  }
];

async function seedCategorias() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    console.log('🌱 Iniciando seed de categorías...');

    for (const catData of categorias) {
      // Verificar si ya existe
      const existente = await em.findOne(Categoria, { nombre: catData.nombre });
      
      if (!existente) {
        const categoria = new Categoria();
        categoria.nombre = catData.nombre;
        categoria.descripcion = catData.descripcion;
        em.persist(categoria);
        await em.flush();
        console.log(`✅ Categoría creada: ${catData.nombre}`);
      } else {
        console.log(`⏭️  Categoría ya existe: ${catData.nombre}`);
      }
    }

    console.log('✨ Seed de categorías completado exitosamente');
  } catch (error) {
    console.error('❌ Error al hacer seed de categorías:', error);
    throw error;
  } finally {
    await orm.close();
  }
}

seedCategorias()
  .then(() => {
    console.log('🎉 Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });

import { MikroORM } from '@mikro-orm/mysql';
import config from '../mikro-orm.config';
import { Libro } from '../entities/libro.entity';

async function checkProblemImages() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    const libros = await em.find(Libro, {}, { 
      populate: ['autor']
    });

    console.log('\n📚 BUSCANDO LIBROS PROBLEMÁTICOS:\n');

    const problemTitles = [
      'Tormenta de espadas',
      'Divergente',
      'Viajero del Alba',
      'travesía'
    ];

    for (const libro of libros) {
      const matches = problemTitles.some(searchTerm => 
        libro.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matches) {
        console.log('---');
        console.log('ID:', libro.id);
        console.log('Título:', libro.nombre);
        console.log('Slug:', libro.slug || 'NO TIENE');
        console.log('Imagen URL:', libro.imagen || 'NO TIENE');
        console.log('Autor:', libro.autor?.nombre || 'N/A');
        
        if (libro.imagen) {
          console.log('Protocolo:', libro.imagen.startsWith('https://') ? '✅ HTTPS' : '❌ HTTP');
        }
        console.log('---\n');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await orm.close();
  }
}

checkProblemImages();

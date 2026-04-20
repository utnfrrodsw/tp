import { MikroORM } from '@mikro-orm/mysql';
import config from '../mikro-orm.config';
import { Libro } from '../entities/libro.entity';

async function checkImageSources() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();
  
  try {
    const libros = await em.find(Libro, {});
    
    const withGoogleContent = libros.filter(l => 
      l.imagen && l.imagen.includes('books.google.com/books/content')
    );
    
    const withOpenLibrary = libros.filter(l => 
      l.imagen && l.imagen.includes('covers.openlibrary.org')
    );
    
    const withGoogleAPI = libros.filter(l => 
      l.imagen && l.imagen.includes('books.google.com/books/content') === false && l.imagen.includes('google') 
    );
    
    const withAmazon = libros.filter(l => 
      l.imagen && l.imagen.includes('amazon')
    );
    
    const withoutImage = libros.filter(l => !l.imagen);
    
    console.log('\n📊 RESUMEN DE FUENTES DE IMÁGENES:\n');
    console.log('=' .repeat(50));
    console.log(`✅ Open Library:         ${withOpenLibrary.length} libros`);
    console.log(`⚠️  Google Books Content: ${withGoogleContent.length} libros (problemáticos)`);
    console.log(`📘 Google Books API:     ${withGoogleAPI.length} libros`);
    console.log(`📦 Amazon/Goodreads:     ${withAmazon.length} libros`);
    console.log(`❌ Sin imagen:           ${withoutImage.length} libros`);
    console.log('=' .repeat(50));
    console.log(`📚 TOTAL:                ${libros.length} libros\n`);
    
    if (withGoogleContent.length > 0) {
      console.log(`⚠️  Quedan ${withGoogleContent.length} libros con URLs problemáticas que deberían reemplazarse`);
    } else {
      console.log('✨ ¡Todas las URLs problemáticas han sido reemplazadas!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await orm.close();
  }
}

checkImageSources();

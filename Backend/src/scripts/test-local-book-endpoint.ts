import axios from 'axios';

async function testLocalBookEndpoint() {
  console.log('🧪 PROBANDO ENDPOINT DE LIBROS LOCALES POR SLUG\n');
  console.log('='.repeat(70));

  const testSlugs = ['1984', 'harry-potter-and-the-philosophers-stone', 'juego-de-tronos'];

  for (const slug of testSlugs) {
    console.log(`\n📖 Probando slug: "${slug}"`);
    console.log(`📍 URL: http://localhost:3000/api/libros/slug/${slug}`);
    
    try {
      const response = await axios.get(`http://localhost:3000/api/libros/slug/${slug}`);
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📚 Título: ${response.data.titulo || response.data.title}`);
      console.log(`👤 Autores: ${response.data.autores?.join(', ')}`);
      console.log(`📝 Descripción: ${response.data.descripcion ? response.data.descripcion.substring(0, 80) + '...' : 'No disponible'}`);
      console.log(`🖼️  Imagen: ${response.data.imagen ? 'Sí' : 'No'}`);
      console.log(`🔗 Source: ${response.data.source}`);
    } catch (error: any) {
      if (error.response) {
        console.log(`❌ Error ${error.response.status}: ${error.response.data.error || 'Error desconocido'}`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    console.log('-'.repeat(70));
  }
}

testLocalBookEndpoint();

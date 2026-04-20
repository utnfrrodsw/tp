import axios from 'axios';
import jwt from 'jsonwebtoken';

async function testRecomendacionesEndpoint() {
  try {
    // Generar un token válido
    const token = jwt.sign(
      { id: 1, email: 'test@test.com', isAdmin: false },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    console.log('🧪 PROBANDO ENDPOINT DE RECOMENDACIONES\n');
    console.log('='.repeat(70));
    
    const response = await axios.get('http://localhost:3000/api/recomendaciones', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    console.log(`\n✅ Status: ${response.status}`);
    console.log(`📊 Libros recibidos: ${response.data.libros?.length || 0}\n`);

    if (response.data.libros && response.data.libros.length > 0) {
      console.log('🖼️  PRIMEROS 5 LIBROS Y SUS IMÁGENES:\n');
      
      response.data.libros.slice(0, 5).forEach((libro: any, index: number) => {
        console.log(`${index + 1}. ${libro.titulo || libro.nombre || 'SIN TÍTULO'}`);
        console.log(`   Imagen: ${libro.imagen || 'NO TIENE'}`);
        console.log(`   Slug: ${libro.slug || 'NO TIENE'}`);
        console.log('');
      });

      // Buscar específicamente "El mar de los monstruos"
      const marMonstruos = response.data.libros.find((l: any) => 
        (l.titulo || l.nombre || '').toLowerCase().includes('mar de los monstruos')
      );

      if (marMonstruos) {
        console.log('🔍 LIBRO ESPECÍFICO: "El mar de los monstruos"');
        console.log('   Título:', marMonstruos.titulo || marMonstruos.nombre);
        console.log('   Imagen:', marMonstruos.imagen);
        console.log('   Slug:', marMonstruos.slug);
      } else {
        console.log('⚠️  "El mar de los monstruos" NO está en las recomendaciones');
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRecomendacionesEndpoint();

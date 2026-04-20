import axios from 'axios';

const url = 'https://books.google.com/books/content?id=Dhxj0AEACAAJ&printsec=frontcover&img=1&zoom=2&source=gbs_api';

async function testUrl() {
  try {
    console.log('🧪 Probando URL de El mar de los monstruos...');
    console.log('📍', url);
    
    const response = await axios.head(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Status:', response.status);
    console.log('📝 Type:', response.headers['content-type']);
  } catch (error: any) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
    }
  }
}

testUrl();

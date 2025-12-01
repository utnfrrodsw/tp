import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

// Define la estructura del resultado de moderación
export interface ModerationResult {
  flagged: boolean;
  categories: any; //!Se usa any para evitar conflictos con las categorias de OpenAI
  category_scores: any; //!Se usa any para evitar conflictos con las puntuaciones de categoria de OpenAI
  error?: string;
  fallback?: boolean;
  foundKeywords?: string[];
}
//! En development, buscamos la OPENAI key en el .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, './../../../../.env') });
// Create a single OpenAI instance with proper configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate that the API key is present
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  throw new Error('OpenAI API key is not configured');
}

export { openai };

//! Función para moderar comentarios usando la API
export const moderateContent = async (
  content: string
): Promise<ModerationResult> => {
  try {
    console.log('Moderando el comentario:', content?.substring(0, 50) + '...');

    if (!content || content.trim() === '') {
      console.log('El contenido está vacío');
      return {
        flagged: false,
        categories: {},
        category_scores: {},
      };
    }

    const moderation = await openai.moderations.create({
      model: 'text-moderation-latest',
      input: content,
    });

    console.log('✅ Moderación exitosa:', {
      flagged: moderation.results[0].flagged,
      categories: moderation.results[0].categories,
    });
    //! Devolvemos solo el primero de los resultados ya que este ese el que lleva
    //! el resultado del analisis completo, y la bandera "flagged" marca si pasa o no
    //! EL resto de los resultados del array son para cada categoría de moderación
    return {
      flagged: moderation.results[0].flagged,
      categories: moderation.results[0].categories,
      category_scores: moderation.results[0].category_scores,
    };
  } catch (error: any) {
    console.error('❌ Error moderando el comentario:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      param: error.param,
    });

    // Handle specific error types
    if (error.status === 429) {
      console.log('Llegaste al límite de la API - usando fallback');
      return handleRateLimitFallback(content);
    }

    if (error.status === 401) {
      console.log('🔑 Fallo de autenticación - verificar la clave');
      return {
        flagged: false,
        categories: {},
        category_scores: {},
        error: 'Authentication failed',
      };
    }
    //Safe default
    return {
      flagged: false,
      categories: {},
      category_scores: {},
      error: error.message,
    };
  }
};

// Moderación simple por palabras clave como fallback
const handleRateLimitFallback = (content: string): ModerationResult => {
  console.log('🔄 Using fallback moderation for rate limit');

  // Simple keyword-based moderation as fallback
  const inappropriateKeywords = [
    'puta',
    'trolo',
    'trola',
    'puto',
    'boludo',
    'pelotudo',
    'sorete',
    'cornudo',
    'culo',
    'forro',
    'forra',
    'mierda',
    'huevo',
    'morite',
    'matar',
    'matate',
  ];

  const lowerContent = content.toLowerCase();
  const foundKeywords = inappropriateKeywords.filter((keyword) =>
    lowerContent.includes(keyword)
  );

  const flagged = foundKeywords.length > 0;

  console.log('📝 Fallback moderation result:', {
    flagged,
    foundKeywords,
    reason: 'Lenguaje inapropiado',
  });

  return {
    flagged,
    categories: {
      violencia: foundKeywords.some((k) =>
        ['morite', 'matar', 'matate'].includes(k)
      ),
      insultos: foundKeywords.some((k) =>
        [
          'puto',
          'puta',
          'boludo',
          'pelotudo',
          'sorete',
          'cornudo',
          'culo',
          'forro',
          'forra',
          'mierda',
          'huevo',
        ].includes(k)
      ),
    },
    category_scores: {},
    fallback: true,
    foundKeywords,
  };
};

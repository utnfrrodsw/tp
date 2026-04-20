/**
 * Servicio para integración con Wikipedia API
 * Obtiene biografías, imágenes y datos estructurados de autores
 */

export interface WikipediaAuthorData {
  name: string;
  extract: string; // Biografía (texto plano)
  extractHtml?: string; // Biografía (HTML formateado)
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  occupation?: string[];
}

export interface WikidataAuthorData {
  nationality?: string;
  birthDate?: string;
  deathDate?: string;
  awards?: string[];
  genres?: string[];
  occupation?: string[];
}

/**
 * Busca información de un autor en Wikipedia
 * @param authorName Nombre del autor a buscar
 * @param language Idioma de Wikipedia (default: 'es')
 */
export const fetchWikipediaAuthor = async (
  authorName: string,
  language: 'es' | 'en' = 'es'
): Promise<WikipediaAuthorData | null> => {
  try {
    const apiUrl = `https://${language}.wikipedia.org/w/api.php`;
    
    // Primero buscar la página
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: authorName,
      srlimit: '1',
      origin: '*'
    });

    const searchResponse = await fetch(`${apiUrl}?${searchParams}`);
    const searchData = await searchResponse.json();

    if (!searchData.query?.search?.[0]) {
      // Intentar en inglés si no hay resultados en español
      if (language === 'es') {
        return fetchWikipediaAuthor(authorName, 'en');
      }
      return null;
    }

    const pageTitle = searchData.query.search[0].title;

    // Obtener contenido de la página
    const contentParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'extracts|pageimages|info',
      exintro: 'true', // Solo introducción
      explaintext: 'true', // Texto plano
      piprop: 'thumbnail',
      pithumbsize: '400',
      inprop: 'url',
      titles: pageTitle,
      origin: '*'
    });

    const contentResponse = await fetch(`${apiUrl}?${contentParams}`);
    const contentData = await contentResponse.json();

    const page = Object.values(contentData.query.pages)[0] as any;

    if (!page || page.missing) {
      return null;
    }

    // También obtener versión HTML para biografía enriquecida
    const htmlParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'extracts',
      exintro: 'true',
      titles: pageTitle,
      origin: '*'
    });

    const htmlResponse = await fetch(`${apiUrl}?${htmlParams}`);
    const htmlData = await htmlResponse.json();
    const htmlPage = Object.values(htmlData.query.pages)[0] as any;

    return {
      name: page.title,
      extract: page.extract || '',
      extractHtml: htmlPage?.extract,
      thumbnail: page.thumbnail,
      pageUrl: page.fullurl || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
    };
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return null;
  }
};

/**
 * Obtiene datos estructurados de Wikidata
 * @param authorName Nombre del autor
 */
export const fetchWikidataAuthor = async (
  authorName: string
): Promise<WikidataAuthorData | null> => {
  try {
    // Buscar entidad en Wikidata
    const searchParams = new URLSearchParams({
      action: 'wbsearchentities',
      format: 'json',
      language: 'es',
      type: 'item',
      search: authorName,
      limit: '1',
      origin: '*'
    });

    const searchResponse = await fetch(`https://www.wikidata.org/w/api.php?${searchParams}`);
    const searchData = await searchResponse.json();

    if (!searchData.search?.[0]) {
      return null;
    }

    const entityId = searchData.search[0].id;

    // Obtener datos de la entidad
    const entityParams = new URLSearchParams({
      action: 'wbgetentities',
      format: 'json',
      ids: entityId,
      props: 'claims',
      origin: '*'
    });

    const entityResponse = await fetch(`https://www.wikidata.org/w/api.php?${entityParams}`);
    const entityData = await entityResponse.json();

    const claims = entityData.entities?.[entityId]?.claims;

    if (!claims) {
      return null;
    }

    // Extraer datos relevantes
    const result: WikidataAuthorData = {};

    // P27 = nationality
    if (claims.P27?.[0]) {
      const nationalityId = claims.P27[0].mainsnak?.datavalue?.value?.id;
      if (nationalityId) {
        // Obtener etiqueta de nacionalidad
        const labelParams = new URLSearchParams({
          action: 'wbgetentities',
          format: 'json',
          ids: nationalityId,
          props: 'labels',
          languages: 'es|en',
          origin: '*'
        });
        const labelResponse = await fetch(`https://www.wikidata.org/w/api.php?${labelParams}`);
        const labelData = await labelResponse.json();
        result.nationality = labelData.entities?.[nationalityId]?.labels?.es?.value || 
                            labelData.entities?.[nationalityId]?.labels?.en?.value;
      }
    }

    // P569 = birth date
    if (claims.P569?.[0]) {
      const birthTime = claims.P569[0].mainsnak?.datavalue?.value?.time;
      if (birthTime) {
        result.birthDate = birthTime.replace('+', '').split('T')[0];
      }
    }

    // P570 = death date
    if (claims.P570?.[0]) {
      const deathTime = claims.P570[0].mainsnak?.datavalue?.value?.time;
      if (deathTime) {
        result.deathDate = deathTime.replace('+', '').split('T')[0];
      }
    }

    // P106 = occupation
    if (claims.P106) {
      result.occupation = [];
      for (const occupation of claims.P106.slice(0, 3)) {
        const occId = occupation.mainsnak?.datavalue?.value?.id;
        if (occId) {
          const labelParams = new URLSearchParams({
            action: 'wbgetentities',
            format: 'json',
            ids: occId,
            props: 'labels',
            languages: 'es|en',
            origin: '*'
          });
          const labelResponse = await fetch(`https://www.wikidata.org/w/api.php?${labelParams}`);
          const labelData = await labelResponse.json();
          const label = labelData.entities?.[occId]?.labels?.es?.value || 
                       labelData.entities?.[occId]?.labels?.en?.value;
          if (label) result.occupation.push(label);
        }
      }
    }

    // P136 = genre
    if (claims.P136) {
      result.genres = [];
      for (const genre of claims.P136.slice(0, 3)) {
        const genreId = genre.mainsnak?.datavalue?.value?.id;
        if (genreId) {
          const labelParams = new URLSearchParams({
            action: 'wbgetentities',
            format: 'json',
            ids: genreId,
            props: 'labels',
            languages: 'es|en',
            origin: '*'
          });
          const labelResponse = await fetch(`https://www.wikidata.org/w/api.php?${labelParams}`);
          const labelData = await labelResponse.json();
          const label = labelData.entities?.[genreId]?.labels?.es?.value || 
                       labelData.entities?.[genreId]?.labels?.en?.value;
          if (label) result.genres.push(label);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching Wikidata:', error);
    return null;
  }
};

/**
 * Combina datos de Wikipedia y Wikidata
 */
export const fetchEnrichedAuthorData = async (
  authorName: string
): Promise<WikipediaAuthorData & WikidataAuthorData | null> => {
  try {
    const [wikipediaData, wikidataData] = await Promise.all([
      fetchWikipediaAuthor(authorName),
      fetchWikidataAuthor(authorName)
    ]);

    if (!wikipediaData) {
      return null;
    }

    return {
      ...wikipediaData,
      ...wikidataData
    };
  } catch (error) {
    console.error('Error fetching enriched author data:', error);
    return null;
  }
};

/**
 * Cache management para reducir llamadas a APIs
 */
const CACHE_KEY_PREFIX = 'wikipedia_author_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

export const getCachedAuthorData = (authorName: string): (WikipediaAuthorData & WikidataAuthorData) | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${authorName}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_TTL) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${authorName}`);
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const setCachedAuthorData = (
  authorName: string,
  data: WikipediaAuthorData & WikidataAuthorData
): void => {
  try {
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${authorName}`,
      JSON.stringify({
        data,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    console.error('Error caching author data:', error);
  }
};

/**
 * Wrapper con cache automático
 */
export const fetchAuthorWithCache = async (
  authorName: string
): Promise<(WikipediaAuthorData & WikidataAuthorData) | null> => {
  // Intentar obtener del cache
  const cached = getCachedAuthorData(authorName);
  if (cached) {
    console.log('📦 Cargado desde caché:', authorName);
    return cached;
  }

  // Si no está en cache, fetch y guardar
  const data = await fetchEnrichedAuthorData(authorName);
  if (data) {
    setCachedAuthorData(authorName, data);
  }

  return data;
};

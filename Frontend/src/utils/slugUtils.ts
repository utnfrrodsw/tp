/**
 * Utilidades para generar slugs URL-friendly
 * Usadas para crear URLs legibles y SEO-friendly para libros
 */

/**
 * Genera un slug URL-friendly desde un título de libro
 * Ejemplo: "Cien Años de Soledad" → "cien-anos-de-soledad"
 * 
 * @param titulo - Título del libro a convertir en slug
 * @returns Slug URL-friendly en minúsculas sin caracteres especiales
 */
export const createSlug = (titulo: string): string => {
  return titulo
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres con acentos (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos (acentos, tildes)
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales (mantener letras, números, espacios y guiones)
    .trim()
    .replace(/\s+/g, '-') // Convertir espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones consecutivos → un solo guión
};

/**
 * Genera un slug único para libros de Google Books
 * Formato: titulo-slug-googleBookId
 * Ejemplo: "cien-anos-soledad-abc123xyz"
 * 
 * El ID de Google Books se añade al final para garantizar unicidad,
 * ya que pueden existir múltiples libros con el mismo título.
 * 
 * @param libro - Objeto con titulo e id del libro de Google Books
 * @returns Slug único combinando título legible + ID corto
 */
export const createGoogleBookSlug = (libro: {
  titulo: string;
  id: string;
}): string => {
  const tituloSlug = createSlug(libro.titulo);
  
  // Extraer primeros 8 caracteres del ID de Google Books para unicidad
  // El ID completo es muy largo (ej: "abc123xyz456def789ghi012")
  const googleId = libro.id.slice(0, 8).toLowerCase();
  
  return `${tituloSlug}-${googleId}`;
};

/**
 * Extrae el ID de Google Books desde un slug generado
 * Ejemplo: "cien-anos-soledad-abc123xyz" → "abc123xyz"
 * 
 * @param slug - Slug generado con createGoogleBookSlug
 * @returns ID corto de Google Books (últimos 8 caracteres después del último guión)
 */
export const extractGoogleIdFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  return parts[parts.length - 1]; // Último segmento = ID
};

/**
 * Extrae el título aproximado desde un slug
 * Ejemplo: "cien-anos-soledad-abc123xyz" → "cien anos soledad"
 * 
 * Útil para búsquedas cuando no se encuentra por ID
 * 
 * @param slug - Slug completo
 * @returns Título reconstruido (sin ID, con espacios)
 */
export const extractTitleFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  // Remover último segmento (ID) y unir con espacios
  return parts.slice(0, -1).join(' ');
};

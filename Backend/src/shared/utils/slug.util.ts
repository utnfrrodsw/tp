// src/shared/utils/slug.util.ts

/**
 * Genera un slug URL-friendly a partir de un texto
 * Ejemplo: "Harry Potter y la Piedra Filosofal" → "harry-potter-y-la-piedra-filosofal"
 * 
 * @param text - Texto a convertir en slug
 * @returns Slug limpio y URL-friendly
 */
export function generateSlug(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .substring(0, 255); // Limitar a 255 caracteres (límite de BD)
}

/**
 * Genera un slug único agregando un sufijo numérico si es necesario
 * 
 * @param baseSlug - Slug base
 * @param existingSlugs - Array de slugs ya existentes
 * @returns Slug único
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

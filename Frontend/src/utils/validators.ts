/**
 * Utilidades de validación para el frontend
 * Valida entrada de usuario antes de enviar al backend
 */

/**
 * Valida formato de email
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida fortaleza de contraseña
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['La contraseña es requerida'] };
  }
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida calificación de libro (1-5 estrellas)
 */
export function validateRating(rating: number): boolean {
  if (typeof rating !== 'number') {
    return false;
  }
  
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

/**
 * Sanitiza entrada de usuario para prevenir XSS
 * Remueve tags HTML y caracteres peligrosos
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Valida longitud de texto (comentarios, reseñas)
 */
export function validateTextLength(
  text: string,
  minLength: number = 0,
  maxLength: number = 5000
): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'El texto es requerido' };
  }
  
  const trimmedText = text.trim();
  
  if (trimmedText.length < minLength) {
    return {
      valid: false,
      error: `El texto debe tener al menos ${minLength} caracteres`
    };
  }
  
  if (trimmedText.length > maxLength) {
    return {
      valid: false,
      error: `El texto no puede exceder ${maxLength} caracteres`
    };
  }
  
  return { valid: true };
}

/**
 * Valida URL
 */
export function validateURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida nombre de usuario
 * Requisitos:
 * - 3-20 caracteres
 * - Solo letras, números, guiones y guiones bajos
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'El nombre de usuario es requerido' };
  }
  
  const trimmedUsername = username.trim();
  
  if (trimmedUsername.length < 3) {
    return { valid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  
  if (trimmedUsername.length > 20) {
    return { valid: false, error: 'El nombre de usuario no puede exceder 20 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
    return {
      valid: false,
      error: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'
    };
  }
  
  return { valid: true };
}

/**
 * Valida número de página para paginación
 */
export function validatePageNumber(page: any): number {
  const pageNum = parseInt(page, 10);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return 1;
  }
  
  return pageNum;
}

/**
 * Valida límite de paginación
 */
export function validateLimit(limit: any, defaultLimit: number = 12, maxLimit: number = 100): number {
  const limitNum = parseInt(limit, 10);
  
  if (isNaN(limitNum) || limitNum < 1) {
    return defaultLimit;
  }
  
  if (limitNum > maxLimit) {
    return maxLimit;
  }
  
  return limitNum;
}

/**
 * Valida ISBN (10 o 13 dígitos)
 */
export function validateISBN(isbn: string): boolean {
  if (!isbn || typeof isbn !== 'string') {
    return false;
  }
  
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  // ISBN-10 o ISBN-13
  return /^(\d{10}|\d{13})$/.test(cleanISBN);
}

/**
 * Valida año de publicación
 */
export function validateYear(year: any): boolean {
  const yearNum = parseInt(year, 10);
  
  if (isNaN(yearNum)) {
    return false;
  }
  
  const currentYear = new Date().getFullYear();
  return yearNum >= 1000 && yearNum <= currentYear + 1;
}

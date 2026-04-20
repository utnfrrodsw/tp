/**
 * Servicio de validación para el backend
 * Valida y sanitiza datos antes de procesarlos
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
 * Valida ISBN (10 o 13 dígitos)
 */
export function validateISBN(isbn: string): boolean {
  if (!isbn || typeof isbn !== 'string') {
    return false;
  }
  
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  return /^(\d{10}|\d{13})$/.test(cleanISBN);
}

/**
 * Valida calificación (1-5)
 */
export function validateRating(rating: any): boolean {
  const num = Number(rating);
  
  if (isNaN(num)) {
    return false;
  }
  
  return num >= 1 && num <= 5 && Number.isInteger(num);
}

/**
 * Sanitiza entrada de usuario
 * Remueve caracteres peligrosos y espacios extras
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Valida y parsea ID numérico
 */
export function parseNumericId(id: any): number | null {
  const numId = Number(id);
  
  if (isNaN(numId) || numId < 1 || !Number.isInteger(numId)) {
    return null;
  }
  
  return numId;
}

/**
 * Valida external ID (string alfanumérico)
 */
export function validateExternalId(id: any): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 0 && id.length <= 100;
}

/**
 * Valida parámetros de paginación
 */
export function validatePagination(page: any, limit: any): { page: number; limit: number } {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  
  return {
    page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
    limit: isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100 ? 12 : parsedLimit
  };
}

/**
 * Valida longitud de texto
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
 * Valida año
 */
export function validateYear(year: any): boolean {
  const yearNum = parseInt(year, 10);
  
  if (isNaN(yearNum)) {
    return false;
  }
  
  const currentYear = new Date().getFullYear();
  return yearNum >= 1000 && yearNum <= currentYear + 1;
}

/**
 * Valida rol de usuario
 */
export function validateUserRole(role: string): boolean {
  const validRoles = ['usuario', 'moderador', 'admin'];
  return validRoles.includes(role);
}

/**
 * Valida estado de reseña
 */
export function validateResenaEstado(estado: string): boolean {
  const validEstados = ['aprobada', 'pendiente', 'rechazada', 'flagged'];
  return validEstados.includes(estado);
}

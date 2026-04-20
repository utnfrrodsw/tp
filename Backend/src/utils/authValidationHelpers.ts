// src/utils/authValidationHelpers.ts
/**
 * Helper functions para validaciones de autenticación.
 * Centraliza validaciones para evitar anidamiento profundo en controllers.
 */

/**
 * Resultado de una validación
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email?: string;
  password?: string;
}

/**
 * Datos para solicitud de reset de contraseña
 */
export interface PasswordResetRequest {
  email?: string;
}

/**
 * Datos para resetear contraseña
 */
export interface PasswordResetData {
  token?: string;
  newPassword?: string;
}

/**
 * Valida las credenciales de login
 */
export function validateLoginCredentials(credentials: LoginCredentials): ValidationResult {
  const { email, password } = credentials;

  if (!email || !password) {
    return {
      isValid: false,
      error: 'Email y contraseña son requeridos',
      statusCode: 400
    };
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Formato de email inválido',
      statusCode: 400
    };
  }

  // Validar longitud mínima de contraseña
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'La contraseña debe tener al menos 6 caracteres',
      statusCode: 400
    };
  }

  return { isValid: true };
}

/**
 * Valida una solicitud de reset de contraseña
 */
export function validatePasswordResetRequest(request: PasswordResetRequest): ValidationResult {
  const { email } = request;

  if (!email) {
    return {
      isValid: false,
      error: 'Email es requerido',
      statusCode: 400
    };
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Formato de email inválido',
      statusCode: 400
    };
  }

  // Sanitizar email
  const sanitizedEmail = email.trim().toLowerCase();

  return { 
    isValid: true,
    error: sanitizedEmail
  };
}

/**
 * Valida los datos para resetear contraseña
 */
export function validatePasswordResetData(data: PasswordResetData): ValidationResult {
  const { token, newPassword } = data;

  if (!token || !newPassword) {
    return {
      isValid: false,
      error: 'Token y nueva contraseña son requeridos',
      statusCode: 400
    };
  }

  // Validar longitud del token
  if (token.length !== 64) { // crypto.randomBytes(32).toString('hex') = 64 chars
    return {
      isValid: false,
      error: 'Token inválido',
      statusCode: 400
    };
  }

  // Validar nueva contraseña
  const passwordValidation = validateNewPassword(newPassword);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  return { isValid: true };
}

/**
 * Valida la fortaleza de una nueva contraseña
 */
export function validateNewPassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Contraseña es requerida',
      statusCode: 400
    };
  }

  // Longitud mínima
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'La contraseña debe tener al menos 6 caracteres',
      statusCode: 400
    };
  }

  // Longitud máxima (prevenir ataques DoS)
  if (password.length > 128) {
    return {
      isValid: false,
      error: 'La contraseña no puede exceder 128 caracteres',
      statusCode: 400
    };
  }

  // Validar que no sea solo espacios
  if (password.trim().length === 0) {
    return {
      isValid: false,
      error: 'La contraseña no puede ser solo espacios',
      statusCode: 400
    };
  }

  return { isValid: true };
}

/**
 * Valida la fortaleza de una contraseña (reglas más estrictas)
 * Opcional: usar para registro de nuevos usuarios
 */
export function validatePasswordStrength(password: string): ValidationResult {
  const basicValidation = validateNewPassword(password);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  // Al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una letra mayúscula',
      statusCode: 400
    };
  }

  // Al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una letra minúscula',
      statusCode: 400
    };
  }

  // Al menos un número
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos un número',
      statusCode: 400
    };
  }

  // Al menos un carácter especial (opcional, comentado por ahora)
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   return {
  //     isValid: false,
  //     error: 'La contraseña debe contener al menos un carácter especial',
  //     statusCode: 400
  //   };
  // }

  return { isValid: true };
}

/**
 * Valida un refresh token
 */
export function validateRefreshToken(refreshToken?: string): ValidationResult {
  if (!refreshToken) {
    return {
      isValid: false,
      error: 'Refresh token es requerido',
      statusCode: 400
    };
  }

  // Validar formato básico de JWT (3 partes separadas por puntos)
  const parts = refreshToken.split('.');
  if (parts.length !== 3) {
    return {
      isValid: false,
      error: 'Formato de refresh token inválido',
      statusCode: 400
    };
  }

  return { isValid: true };
}

/**
 * Sanitiza un email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Valida datos de registro de usuario
 */
export interface RegistrationData {
  email?: string;
  password?: string;
  username?: string;
  nombre?: string;
}

export function validateRegistrationData(data: RegistrationData): ValidationResult {
  const { email, password, username, nombre } = data;

  // Validar email
  if (!email) {
    return {
      isValid: false,
      error: 'Email es requerido',
      statusCode: 400
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Formato de email inválido',
      statusCode: 400
    };
  }

  // Validar password
  const passwordValidation = validateNewPassword(password || '');
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // Validar username
  if (!username || username.trim().length < 3) {
    return {
      isValid: false,
      error: 'El nombre de usuario debe tener al menos 3 caracteres',
      statusCode: 400
    };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      error: 'El nombre de usuario no puede exceder 50 caracteres',
      statusCode: 400
    };
  }

  // Validar que username solo contenga caracteres permitidos
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos',
      statusCode: 400
    };
  }

  // Validar nombre (opcional)
  if (nombre && nombre.length > 100) {
    return {
      isValid: false,
      error: 'El nombre no puede exceder 100 caracteres',
      statusCode: 400
    };
  }

  return { isValid: true };
}

/**
 * Mensajes de respuesta estándar para autenticación
 */
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login exitoso',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  PASSWORD_RESET_SENT: 'Si el email existe, recibirás un enlace de recuperación',
  PASSWORD_RESET_SUCCESS: 'Contraseña actualizada exitosamente',
  TOKEN_INVALID: 'Token inválido o expirado',
  TOKEN_USED: 'Este token ya ha sido utilizado',
  REGISTRATION_SUCCESS: 'Usuario registrado exitosamente',
  EMAIL_EXISTS: 'Este email ya está registrado',
  USERNAME_EXISTS: 'Este nombre de usuario ya está en uso',
  SERVER_ERROR: 'Error del servidor'
} as const;

/**
 * Códigos de error estándar
 */
export const AUTH_ERROR_CODES = {
  MISSING_FIELDS: 'MISSING_FIELDS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_EXISTS: 'USER_EXISTS'
} as const;

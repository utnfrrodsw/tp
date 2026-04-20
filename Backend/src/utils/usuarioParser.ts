// src/utils/usuarioParser.ts
import {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeInput,
  parseNumericId,
  validatePagination,
  validateUserRole
} from '../services/validation.service';

/**
 * Parsea y valida los datos de entrada para crear un usuario
 */
export function parseUserRegistration(body: any): {
  valid: boolean;
  data?: {
    email: string;
    username: string;
    password: string;
    rol?: string;
    nombre?: string;
    apellido?: string;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Validar email (requerido)
  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    errors.push('El email es requerido');
  } else if (!validateEmail(body.email.trim())) {
    errors.push('El email no tiene un formato válido');
  }

  // Validar username (requerido)
  if (!body.username || typeof body.username !== 'string' || !body.username.trim()) {
    errors.push('El nombre de usuario es requerido');
  } else {
    const usernameValidation = validateUsername(body.username.trim());
    if (!usernameValidation.valid) {
      errors.push(usernameValidation.error!);
    }
  }

  // Validar password (requerido)
  if (!body.password || typeof body.password !== 'string') {
    errors.push('La contraseña es requerida');
  } else {
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }
  }

  // Validar rol (opcional)
  if (body.rol && !validateUserRole(body.rol)) {
    errors.push('El rol de usuario no es válido');
  }

  // Validar nombre y apellido (opcionales)
  if (body.nombre && typeof body.nombre === 'string') {
    if (body.nombre.trim().length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }
  }

  if (body.apellido && typeof body.apellido === 'string') {
    if (body.apellido.trim().length > 100) {
      errors.push('El apellido no puede tener más de 100 caracteres');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Construir objeto limpio
  const cleanData: any = {
    email: body.email.trim().toLowerCase(),
    username: sanitizeInput(body.username.trim()),
    password: body.password, // No sanitizar la contraseña
  };

  if (body.rol) {
    cleanData.rol = body.rol;
  }

  if (body.nombre && body.nombre.trim()) {
    cleanData.nombre = sanitizeInput(body.nombre.trim());
  }

  if (body.apellido && body.apellido.trim()) {
    cleanData.apellido = sanitizeInput(body.apellido.trim());
  }

  return { valid: true, data: cleanData };
}

/**
 * Parsea y valida los datos de actualización de perfil de usuario
 */
export function parseUserProfileUpdate(body: any): {
  valid: boolean;
  data?: any;
  errors?: string[];
} {
  const errors: string[] = [];
  const updates: any = {};

  // Validar email si se proporciona
  if (body.email !== undefined) {
    if (!body.email || !validateEmail(body.email.trim())) {
      errors.push('El email no tiene un formato válido');
    } else {
      updates.email = body.email.trim().toLowerCase();
    }
  }

  // Validar username si se proporciona
  if (body.username !== undefined) {
    const usernameValidation = validateUsername(body.username?.trim() || '');
    if (!usernameValidation.valid) {
      errors.push(usernameValidation.error!);
    } else {
      updates.username = sanitizeInput(body.username.trim());
    }
  }

  // Validar password si se proporciona
  if (body.password !== undefined) {
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    } else {
      updates.password = body.password; // No sanitizar
    }
  }

  // Validar nombre si se proporciona
  if (body.nombre !== undefined) {
    if (body.nombre && typeof body.nombre === 'string') {
      const nombre = body.nombre.trim();
      if (nombre.length > 100) {
        errors.push('El nombre no puede tener más de 100 caracteres');
      } else {
        updates.nombre = sanitizeInput(nombre);
      }
    } else {
      updates.nombre = null;
    }
  }

  // Validar apellido si se proporciona
  if (body.apellido !== undefined) {
    if (body.apellido && typeof body.apellido === 'string') {
      const apellido = body.apellido.trim();
      if (apellido.length > 100) {
        errors.push('El apellido no puede tener más de 100 caracteres');
      } else {
        updates.apellido = sanitizeInput(apellido);
      }
    } else {
      updates.apellido = null;
    }
  }

  // Validar foto_perfil si se proporciona
  if (body.foto_perfil !== undefined) {
    if (body.foto_perfil && typeof body.foto_perfil === 'string') {
      updates.foto_perfil = body.foto_perfil.trim();
    } else {
      updates.foto_perfil = null;
    }
  }

  // Validar biografia si se proporciona
  if (body.biografia !== undefined) {
    if (body.biografia && typeof body.biografia === 'string') {
      const biografia = body.biografia.trim();
      if (biografia.length > 1000) {
        errors.push('La biografía no puede tener más de 1000 caracteres');
      } else {
        updates.biografia = sanitizeInput(biografia);
      }
    } else {
      updates.biografia = null;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  if (Object.keys(updates).length === 0) {
    return { valid: false, errors: ['No se proporcionaron datos para actualizar'] };
  }

  return { valid: true, data: updates };
}

/**
 * Parsea los filtros de búsqueda de usuarios
 */
export function parseUserFilters(query: any): {
  search?: string;
  rol?: string;
  page: number;
  limit: number;
} {
  const filters: any = {};

  // Búsqueda por texto
  if (query.search && typeof query.search === 'string') {
    const searchTerm = query.search.trim();
    if (searchTerm.length >= 2) {
      filters.search = sanitizeInput(searchTerm);
    }
  }

  // Filtro por rol
  if (query.rol && validateUserRole(query.rol)) {
    filters.rol = query.rol;
  }

  // Paginación
  const pagination = validatePagination(query.page, query.limit);
  filters.page = pagination.page;
  filters.limit = pagination.limit;

  return filters;
}

/**
 * Construye el query de búsqueda para usuarios
 */
export function buildUserQuery(filters: ReturnType<typeof parseUserFilters>): any {
  const where: any = {};

  // Búsqueda por texto en username o email
  if (filters.search) {
    where.$or = [
      { username: { $like: `%${filters.search}%` } },
      { email: { $like: `%${filters.search}%` } },
      { nombre: { $like: `%${filters.search}%` } },
      { apellido: { $like: `%${filters.search}%` } }
    ];
  }

  // Filtro por rol
  if (filters.rol) {
    where.rol = filters.rol;
  }

  return where;
}

/**
 * Valida un ID de usuario
 */
export function validateUserId(id: any): {
  valid: boolean;
  id?: number;
  error?: string;
} {
  const numericId = parseNumericId(id);

  if (!numericId) {
    return {
      valid: false,
      error: 'ID de usuario inválido'
    };
  }

  return {
    valid: true,
    id: numericId
  };
}

/**
 * Parsea datos de login
 */
export function parseLoginCredentials(body: any): {
  valid: boolean;
  data?: {
    email: string;
    password: string;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Validar email
  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    errors.push('El email es requerido');
  } else if (!validateEmail(body.email.trim())) {
    errors.push('El email no tiene un formato válido');
  }

  // Validar password
  if (!body.password || typeof body.password !== 'string' || !body.password) {
    errors.push('La contraseña es requerida');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      email: body.email.trim().toLowerCase(),
      password: body.password, // No sanitizar contraseñas
    }
  };
}

/**
 * Parsea cambio de contraseña
 */
export function parsePasswordChange(body: any): {
  valid: boolean;
  data?: {
    currentPassword: string;
    newPassword: string;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Validar contraseña actual
  if (!body.currentPassword || typeof body.currentPassword !== 'string') {
    errors.push('La contraseña actual es requerida');
  }

  // Validar nueva contraseña
  if (!body.newPassword || typeof body.newPassword !== 'string') {
    errors.push('La nueva contraseña es requerida');
  } else {
    const passwordValidation = validatePassword(body.newPassword);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }
  }

  // Validar que las contraseñas sean diferentes
  if (body.currentPassword && body.newPassword && body.currentPassword === body.newPassword) {
    errors.push('La nueva contraseña debe ser diferente a la actual');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    }
  };
}

/**
 * Elimina campos sensibles de un objeto usuario para respuestas
 */
export function sanitizeUserResponse(user: any): any {
  const { password, refreshToken, ...sanitized } = user;
  return sanitized;
}

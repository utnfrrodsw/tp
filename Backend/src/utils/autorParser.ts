// src/utils/autorParser.ts
import {
  sanitizeInput,
  parseNumericId,
  validateTextLength,
  validatePagination,
  validateURL,
  validateExternalId
} from '../services/validation.service';

/**
 * Parsea y valida los datos de entrada para crear un autor
 */
export function parseAutorInput(body: any): {
  valid: boolean;
  data?: {
    nombre: string;
    apellido: string;
    biografia?: string;
    foto?: string;
    googleBooksId?: string;
    openLibraryKey?: string;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Validar nombre (requerido)
  if (!body.nombre || typeof body.nombre !== 'string' || !body.nombre.trim()) {
    errors.push('El nombre del autor es requerido');
  }

  const nombreValidation = validateTextLength(body.nombre?.trim() || '', 1, 200);
  if (!nombreValidation.valid) {
    errors.push(nombreValidation.error!);
  }

  // Validar apellido (requerido)
  if (!body.apellido || typeof body.apellido !== 'string' || !body.apellido.trim()) {
    errors.push('El apellido del autor es requerido');
  }

  const apellidoValidation = validateTextLength(body.apellido?.trim() || '', 1, 200);
  if (!apellidoValidation.valid) {
    errors.push(apellidoValidation.error!);
  }

  // Validar biografía (opcional)
  if (body.biografia) {
    const biografiaValidation = validateTextLength(body.biografia.trim(), 0, 10000);
    if (!biografiaValidation.valid) {
      errors.push(biografiaValidation.error!);
    }
  }

  // Validar foto URL (opcional)
  if (body.foto && body.foto.trim() && !validateURL(body.foto.trim())) {
    errors.push('La URL de la foto no es válida');
  }

  // Validar external IDs (opcional)
  if (body.googleBooksId && !validateExternalId(body.googleBooksId)) {
    errors.push('El Google Books ID no es válido');
  }

  if (body.openLibraryKey && !validateExternalId(body.openLibraryKey)) {
    errors.push('El Open Library Key no es válido');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Construir objeto limpio
  const cleanData: any = {
    nombre: sanitizeInput(body.nombre.trim()),
    apellido: sanitizeInput(body.apellido.trim()),
  };

  if (body.biografia) {
    cleanData.biografia = sanitizeInput(body.biografia.trim());
  }

  if (body.foto) {
    cleanData.foto = body.foto.trim();
  }

  if (body.googleBooksId) {
    cleanData.googleBooksId = sanitizeInput(body.googleBooksId.trim());
  }

  if (body.openLibraryKey) {
    cleanData.openLibraryKey = sanitizeInput(body.openLibraryKey.trim());
  }

  return { valid: true, data: cleanData };
}

/**
 * Parsea los filtros de búsqueda de autores
 */
export function parseAutorFilters(query: any): {
  search?: string;
  sortBy?: 'nombre' | 'apellido' | 'createdAt';
  page: number;
  limit: number;
} {
  const filters: any = {};

  // Búsqueda por texto
  if (query.search && typeof query.search === 'string') {
    const searchTerm = query.search.trim();
    
    // Validar longitud mínima
    if (searchTerm.length >= 2) {
      filters.search = sanitizeInput(searchTerm);
    }
  }

  // Ordenamiento
  const validSortFields = ['nombre', 'apellido', 'createdAt'];
  if (query.sortBy && validSortFields.includes(query.sortBy)) {
    filters.sortBy = query.sortBy;
  } else {
    filters.sortBy = 'nombre'; // Por defecto
  }

  // Paginación (con límite máximo de 100)
  const pagination = validatePagination(query.page, query.limit);
  filters.page = pagination.page;
  filters.limit = Math.min(pagination.limit, 100);

  return filters;
}

/**
 * Parsea los datos de actualización de un autor
 */
export function parseAutorUpdateInput(body: any): {
  valid: boolean;
  data?: any;
  errors?: string[];
} {
  const errors: string[] = [];
  const updates: any = {};

  // Validar nombre si se proporciona
  if (body.nombre !== undefined) {
    if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
      errors.push('El nombre del autor no puede estar vacío');
    } else {
      const nombreValidation = validateTextLength(body.nombre.trim(), 1, 200);
      if (!nombreValidation.valid) {
        errors.push(nombreValidation.error!);
      } else {
        updates.nombre = sanitizeInput(body.nombre.trim());
      }
    }
  }

  // Validar apellido si se proporciona
  if (body.apellido !== undefined) {
    if (typeof body.apellido !== 'string' || !body.apellido.trim()) {
      errors.push('El apellido del autor no puede estar vacío');
    } else {
      const apellidoValidation = validateTextLength(body.apellido.trim(), 1, 200);
      if (!apellidoValidation.valid) {
        errors.push(apellidoValidation.error!);
      } else {
        updates.apellido = sanitizeInput(body.apellido.trim());
      }
    }
  }

  // Validar biografía si se proporciona
  if (body.biografia !== undefined) {
    if (body.biografia) {
      const biografiaValidation = validateTextLength(body.biografia.trim(), 0, 10000);
      if (!biografiaValidation.valid) {
        errors.push(biografiaValidation.error!);
      } else {
        updates.biografia = sanitizeInput(body.biografia.trim());
      }
    } else {
      updates.biografia = null;
    }
  }

  // Validar foto si se proporciona
  if (body.foto !== undefined) {
    if (body.foto && body.foto.trim() && !validateURL(body.foto.trim())) {
      errors.push('La URL de la foto no es válida');
    } else {
      updates.foto = body.foto?.trim() || null;
    }
  }

  // Validar external IDs si se proporcionan
  if (body.googleBooksId !== undefined) {
    if (body.googleBooksId && !validateExternalId(body.googleBooksId)) {
      errors.push('El Google Books ID no es válido');
    } else {
      updates.googleBooksId = body.googleBooksId ? sanitizeInput(body.googleBooksId.trim()) : null;
    }
  }

  if (body.openLibraryKey !== undefined) {
    if (body.openLibraryKey && !validateExternalId(body.openLibraryKey)) {
      errors.push('El Open Library Key no es válido');
    } else {
      updates.openLibraryKey = body.openLibraryKey ? sanitizeInput(body.openLibraryKey.trim()) : null;
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
 * Construye el query de búsqueda para autores
 */
export function buildAutorQuery(filters: ReturnType<typeof parseAutorFilters>): any {
  const where: any = {};

  // Búsqueda por texto en nombre o apellido
  if (filters.search) {
    where.$or = [
      { nombre: { $like: `%${filters.search}%` } },
      { apellido: { $like: `%${filters.search}%` } }
    ];
  }

  return where;
}

/**
 * Valida un ID de autor
 */
export function validateAutorId(id: any): {
  valid: boolean;
  id?: number;
  error?: string;
} {
  const numericId = parseNumericId(id);

  if (!numericId) {
    return {
      valid: false,
      error: 'ID de autor inválido'
    };
  }

  return {
    valid: true,
    id: numericId
  };
}

/**
 * Parsea datos de autor externo (desde API)
 */
export function parseExternalAutorData(data: any): {
  valid: boolean;
  data?: {
    nombre: string;
    apellido: string;
    biografia?: string;
    foto?: string;
    googleBooksId?: string;
    openLibraryKey?: string;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Intentar extraer nombre y apellido del campo 'name'
  let nombre = '';
  let apellido = '';

  if (data.name && typeof data.name === 'string') {
    const parts = data.name.trim().split(' ');
    if (parts.length === 1) {
      nombre = parts[0];
      apellido = parts[0]; // Usar el mismo valor si solo hay un nombre
    } else if (parts.length >= 2) {
      nombre = parts[0];
      apellido = parts.slice(1).join(' ');
    }
  } else if (data.nombre && data.apellido) {
    nombre = data.nombre;
    apellido = data.apellido;
  }

  if (!nombre || !apellido) {
    errors.push('No se pudo extraer nombre y apellido del autor externo');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const cleanData: any = {
    nombre: sanitizeInput(nombre.trim()),
    apellido: sanitizeInput(apellido.trim()),
  };

  // Campos opcionales
  if (data.biografia || data.bio || data.description) {
    const biografia = data.biografia || data.bio || data.description;
    if (biografia && typeof biografia === 'string') {
      cleanData.biografia = sanitizeInput(biografia.trim().substring(0, 10000));
    }
  }

  if (data.foto || data.photo || data.image) {
    const foto = data.foto || data.photo || data.image;
    if (foto && typeof foto === 'string' && validateURL(foto.trim())) {
      cleanData.foto = foto.trim();
    }
  }

  if (data.googleBooksId && validateExternalId(data.googleBooksId)) {
    cleanData.googleBooksId = sanitizeInput(data.googleBooksId.trim());
  }

  if (data.openLibraryKey && validateExternalId(data.openLibraryKey)) {
    cleanData.openLibraryKey = sanitizeInput(data.openLibraryKey.trim());
  }

  return { valid: true, data: cleanData };
}

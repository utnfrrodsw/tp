/**
 * Símbolos para inyección de dependencias
 * Usados como claves en el contenedor DI
 */

// Repositories
export const TYPES = {
  // Repositories
  LibroRepository: 'ILibroRepository',
  ResenaRepository: 'IResenaRepository',
  AutorRepository: 'IAutorRepository',
  UsuarioRepository: 'IUsuarioRepository',

  // Services
  LibroService: 'ILibroService',
  ResenaService: 'IResenaService',
  AutorService: 'IAutorService',
  UsuarioService: 'IUsuarioService',

  // ORM
  EntityManager: 'EntityManager',
} as const;

export type DIType = typeof TYPES[keyof typeof TYPES];

import type { EntityManager } from '@mikro-orm/core';
import { TYPES } from './types';

// Repositories
import { MikroORMLibroRepository } from '../repositories/implementations/MikroORMLibroRepository';
import { MikroORMResenaRepository } from '../repositories/implementations/MikroORMResenaRepository';
import { MikroORMAutorRepository } from '../repositories/implementations/MikroORMAutorRepository';
import { MikroORMUsuarioRepository } from '../repositories/implementations/MikroORMUsuarioRepository';

// Interfaces
import type { ILibroRepository } from '../interfaces/ILibroRepository';
import type { IResenaRepository } from '../interfaces/IResenaRepository';
import type { IAutorRepository } from '../interfaces/IAutorRepository';
import type { IUsuarioRepository } from '../interfaces/IUsuarioRepository';

/**
 * Contenedor de Inyección de Dependencias
 * Implementación simple sin librerías externas
 * 
 * Uso:
 * ```typescript
 * // Inicializar en app.ts
 * DIContainer.initialize(orm.em);
 * 
 * // Resolver en controllers
 * const libroService = DIContainer.resolve<ILibroService>(TYPES.LibroService);
 * ```
 */
export class DIContainer {
  private static instances = new Map<string, any>();

  /**
   * Registrar una instancia en el contenedor
   */
  static register(key: string, instance: any): void {
    this.instances.set(key, instance);
  }

  /**
   * Resolver (obtener) una instancia del contenedor
   */
  static resolve<T>(key: string): T {
    const instance = this.instances.get(key);
    if (!instance) {
      throw new Error(`[DIContainer] No se encontró instancia para: ${key}`);
    }
    return instance;
  }

  /**
   * Verificar si una instancia está registrada
   */
  static has(key: string): boolean {
    return this.instances.has(key);
  }

  /**
   * Limpiar todas las instancias (útil para testing)
   */
  static clear(): void {
    this.instances.clear();
  }

  /**
   * Inicializar contenedor con EntityManager
   * Registra todos los repositories y services
   */
  static initialize(em: EntityManager): void {
    console.log('[DIContainer] Inicializando contenedor de dependencias...');

    // Registrar EntityManager
    this.register(TYPES.EntityManager, em);

    // ===========================
    // Registrar Repositories
    // ===========================
    const libroRepo = new MikroORMLibroRepository(em);
    this.register(TYPES.LibroRepository, libroRepo);
    console.log('[DIContainer] ✅ LibroRepository registrado');

    const resenaRepo = new MikroORMResenaRepository(em);
    this.register(TYPES.ResenaRepository, resenaRepo);
    console.log('[DIContainer] ✅ ResenaRepository registrado');

    const autorRepo = new MikroORMAutorRepository(em);
    this.register(TYPES.AutorRepository, autorRepo);
    console.log('[DIContainer] ✅ AutorRepository registrado');

    const usuarioRepo = new MikroORMUsuarioRepository(em);
    this.register(TYPES.UsuarioRepository, usuarioRepo);
    console.log('[DIContainer] ✅ UsuarioRepository registrado');

    // ===========================
    // Registrar Services
    // ===========================
    // TODO: Descomentar cuando se implementen los services
    /*
    const libroService = new LibroService(libroRepo);
    this.register(TYPES.LibroService, libroService);
    console.log('[DIContainer] ✅ LibroService registrado');

    const resenaService = new ResenaService(resenaRepo, libroRepo, usuarioRepo);
    this.register(TYPES.ResenaService, resenaService);
    console.log('[DIContainer] ✅ ResenaService registrado');

    const autorService = new AutorService(autorRepo);
    this.register(TYPES.AutorService, autorService);
    console.log('[DIContainer] ✅ AutorService registrado');

    const usuarioService = new UsuarioService(usuarioRepo);
    this.register(TYPES.UsuarioService, usuarioService);
    console.log('[DIContainer] ✅ UsuarioService registrado');
    */

    console.log('[DIContainer] ✅ Contenedor inicializado correctamente');
  }

  /**
   * Obtener resumen de instancias registradas
   */
  static getRegisteredKeys(): string[] {
    return Array.from(this.instances.keys());
  }

  /**
   * Imprimir diagnóstico del contenedor
   */
  static diagnose(): void {
    console.log('\n=== DIContainer Diagnóstico ===');
    console.log(`Total instancias: ${this.instances.size}`);
    console.log('Registradas:');
    this.getRegisteredKeys().forEach((key) => {
      console.log(`  - ${key}`);
    });
    console.log('===============================\n');
  }
}

// Exportar para facilitar uso
export { TYPES };
export type {
  ILibroRepository,
  IResenaRepository,
  IAutorRepository,
  IUsuarioRepository,
};

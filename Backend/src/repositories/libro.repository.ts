// src/repositories/libro.repository.ts
import { EntityRepository } from '@mikro-orm/mysql';
import { Libro } from '../entities/libro.entity';

export class LibroRepository extends EntityRepository<Libro> {}

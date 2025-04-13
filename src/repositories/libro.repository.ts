// src/repositories/libro.repository.ts
import { EntityRepository } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';

export class LibroRepository extends EntityRepository<Libro> {}

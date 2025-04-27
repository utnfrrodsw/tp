// src/repositories/categoria.repository.ts
import { EntityRepository } from '@mikro-orm/core';
import { Categoria } from '../entities/categoria.entity';

export class CategoriaRepository extends EntityRepository<Categoria> {}

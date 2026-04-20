// src/repositories/categoria.repository.ts
import { EntityRepository } from '@mikro-orm/mysql';
import { Categoria } from '../entities/categoria.entity';

export class CategoriaRepository extends EntityRepository<Categoria> {}

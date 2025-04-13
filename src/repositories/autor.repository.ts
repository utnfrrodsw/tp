// src/repositories/autor.repository.ts
import { EntityRepository } from '@mikro-orm/core';
import { Autor } from '../entities/autor.entity';

export class AutorRepository extends EntityRepository<Autor> {}

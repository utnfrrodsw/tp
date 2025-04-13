// src/repositories/resena.repository.ts
import { EntityRepository } from '@mikro-orm/core';
import { Resena } from '../entities/resena.entity';

export class ResenaRepository extends EntityRepository<Resena> {}

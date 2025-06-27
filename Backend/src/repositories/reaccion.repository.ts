// src/repositories/reaccion.repository.ts
import { EntityRepository } from '@mikro-orm/mysql';
import { Reaccion } from '../entities/reaccion.entity';

export class ReaccionRepository extends EntityRepository<Reaccion> {}

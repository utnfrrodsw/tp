// src/repositories/seguimiento.repository.ts
import { EntityRepository } from '@mikro-orm/mysql';
import { Seguimiento } from '../entities/seguimiento.entity';

export class SeguimientoRepository extends EntityRepository<Seguimiento> {}

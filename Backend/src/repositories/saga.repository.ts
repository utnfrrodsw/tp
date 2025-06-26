import { EntityRepository } from '@mikro-orm/mysql';
import { Saga } from '../entities/saga.entity';

export class SagaRepository extends EntityRepository<Saga> {}

import { EntityRepository } from '@mikro-orm/mysql';
import { Lista } from '../entities/lista.entity';

export class ListaRepository extends EntityRepository<Lista> {}

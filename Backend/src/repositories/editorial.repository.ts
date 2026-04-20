import { EntityRepository } from '@mikro-orm/mysql';
import { Editorial } from '../entities/editorial.entity';

export class EditorialRepository extends EntityRepository<Editorial> {}

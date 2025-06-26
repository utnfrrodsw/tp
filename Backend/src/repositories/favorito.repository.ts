import { EntityRepository } from '@mikro-orm/mysql';
import { Favorito } from '../entities/favorito.entity';

export class FavoritoRepository extends EntityRepository<Favorito> {}

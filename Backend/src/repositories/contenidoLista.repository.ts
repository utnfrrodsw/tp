import { EntityRepository } from '@mikro-orm/mysql';
import { ContenidoLista } from '../entities/contenidoLista.entity';

export class ContenidoListaRepository extends EntityRepository<ContenidoLista> {}

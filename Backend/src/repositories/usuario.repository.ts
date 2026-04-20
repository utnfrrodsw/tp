// src/repositories/usuario.repository.ts
import { EntityRepository } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';

export class UsuarioRepository extends EntityRepository<Usuario> {}

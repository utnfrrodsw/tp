// src/entities/votacionLibro.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, Unique, Enum } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Libro } from './libro.entity';

export enum TipoVoto {
  POSITIVO = 'positivo',
  NEGATIVO = 'negativo',
}

@Entity()
@Unique({ properties: ['usuario', 'libro'] }) // Un usuario solo puede votar una vez por libro
export class VotacionLibro {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @ManyToOne(() => Libro)
  libro!: Libro;

  @Enum(() => TipoVoto)
  voto!: TipoVoto;

  @Property()
  fechaVoto: Date = new Date();
}

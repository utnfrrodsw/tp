import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { ContenidoLista } from './contenidoLista.entity';

@Entity()
export class Lista {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  ultimaModificacion: Date = new Date();

  @ManyToOne()
  usuario!: Usuario;

  @OneToMany(() => ContenidoLista, contenido => contenido.lista)
  contenidos = new Collection<ContenidoLista>(this);
}

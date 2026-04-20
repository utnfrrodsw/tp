// src/entities/lista.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum, Cascade } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { ContenidoLista } from './contenidoLista.entity';

export enum TipoLista {
  READ = 'read',
  TO_READ = 'to_read',
  PENDING = 'pending',
  CUSTOM = 'custom',
}

@Entity()
export class Lista {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Enum(() => TipoLista)
  tipo: TipoLista = TipoLista.CUSTOM; // por defecto, lista personalizada

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  ultimaModificacion: Date = new Date();

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Usuario;

  @OneToMany(() => ContenidoLista, cl => cl.lista, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
  contenidos = new Collection<ContenidoLista>(this);
}

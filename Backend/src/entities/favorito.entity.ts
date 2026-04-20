// src/entities/favorito.entity.ts
import { Entity, PrimaryKey, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Libro } from './libro.entity';

@Entity()
@Unique({ properties: ['usuario', 'libro'] }) // evita que un usuario agregue el mismo libro más de una vez
export class Favorito {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Usuario;

  @ManyToOne(() => Libro, { nullable: false })
  libro!: Libro;

  @Property({ type: 'date', onCreate: () => new Date() })
  fechaAgregado: Date = new Date();

  @Property({ type: 'date', onCreate: () => new Date(), onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}

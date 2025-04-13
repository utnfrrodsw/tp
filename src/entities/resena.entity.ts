import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Libro } from './libro.entity';

@Entity()
export class Resena {
  @PrimaryKey()
  id!: number;

  @Property()
  comentario!: string;

  @Property()
  estrellas!: number;

  @Property()
  fechaResena!: Date;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @ManyToOne(() => Libro)
  libro!: Libro;
}

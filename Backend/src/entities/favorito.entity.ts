import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Libro } from './libro.entity';

@Entity()
export class Favorito {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  usuario!: Usuario;

  @ManyToOne()
  libro!: Libro;

  @Property()
  fechaAgregado: Date = new Date();
}

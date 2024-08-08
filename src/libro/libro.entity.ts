import {
  Entity,
  ManyToMany,
  Property,
  Collection,
  ManyToOne,
  Rel,
  OneToMany,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";

import { Autor } from "../autor/autor.entity.js";
import { Editorial } from "../editorial/editorial.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";

@Entity()
export class Libro extends BaseEntity {
  @Property()
  titulo!: string;

  @Property()
  descripcion!: string;

  @Property()
  isbn!: string;

  @Property({ hidden: true }) //Anotar
  codigoEjemplarActual = 0;

  @ManyToMany(() => Autor, (autor) => autor.misLibros, { owner: true })
  misAutores = new Collection<Autor>(this);

  @ManyToOne(() => Editorial)
  miEditorial!: Rel<Editorial>;

  @OneToMany(() => Ejemplar, (ejemplar) => ejemplar.miLibro, {})
  misEjemplares = new Collection<Ejemplar>(this);

  // Metodos

  getCodigoEjemplarActual(): number {
    this.codigoEjemplarActual++;
    return this.codigoEjemplarActual;
  }
}

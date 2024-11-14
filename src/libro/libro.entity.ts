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
  @Property({ unique: true })
  titulo!: string;

  @Property()
  descripcion!: string;

  @Property({ unique: true })
  isbn!: string;

  @Property() //Contemplar hidden
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
  fuistePrestado(): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misEjemplares.length && rta != true) {
      rta = this.misEjemplares[i].fuistePrestado();
      i++;
    }
    return rta;
  }
  getId(): number | undefined {
    return this.id;
  }
}

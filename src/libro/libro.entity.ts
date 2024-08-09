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
  toJSON(includeEjemplares = true) {
    const json: any = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      isbn: this.isbn,
      codigoEjemplarActual: this.codigoEjemplarActual,
      // No incluimos codigoEjemplarActual ya que está marcado como hidden
    };

    if (includeEjemplares) {
      json.misEjemplares = this.misEjemplares
        .getItems()
        .map((ejemplar) => ejemplar.toJSON(false));
    }

    return json;
  }
}

import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
  ManyToMany,
  BeforeDelete,
  EventArgs,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { errorDominio } from "../shared/DB/errors.js";
import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Autor extends BaseEntity {
  @Property()
  nombre!: string;

  @Property()
  apellido!: string;

  @ManyToMany(() => Libro, (libro) => libro.misAutores, {})
  misLibros = new Collection<Libro>(this);

  @BeforeDelete()
  async existenLibros({ em }: EventArgs<this>) {
    const count = await em.count(Autor, { misLibros: this });
    if (count > 0) {
      throw new errorDominio("No se puede eliminar un Autor que posea libros.");
    }
  }
}

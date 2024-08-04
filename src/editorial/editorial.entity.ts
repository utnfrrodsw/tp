import {
  Entity,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  BeforeDelete,
  EventArgs,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { errorDominio } from "../shared/DB/errors.js";

@Entity()
export class Editorial extends BaseEntity {
  @Property()
  nombre!: string;

  @ManyToMany(() => Libro, (libro) => libro.misEditoriales, {})
  misLibros = new Collection<Libro>(this);

  @BeforeDelete()
  async existenLibros({ em }: EventArgs<this>) {
    const count = await em.count(Libro, { misEditoriales: this });
    if (count > 0) {
      throw new errorDominio(
        "No se puede eliminar una Editorial que posea libros."
      );
    }
  }
}

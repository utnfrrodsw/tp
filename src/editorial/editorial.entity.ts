import {
  Entity,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  BeforeDelete,
  EventArgs,
  OneToMany,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { errorDominio } from "../shared/DB/errors.js";

@Entity()
export class Editorial extends BaseEntity {
  @Property()
  nombre!: string;

  @OneToMany(() => Libro, (libro) => libro.miEditorial)
  misLibros = new Collection<Libro>(this);
}

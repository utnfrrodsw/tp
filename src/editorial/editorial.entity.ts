import { Entity, Property, Collection, OneToMany } from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Editorial extends BaseEntity {
  @Property({ unique: true })
  nombre!: string;

  @OneToMany(() => Libro, (libro) => libro.miEditorial)
  misLibros = new Collection<Libro>(this);
}

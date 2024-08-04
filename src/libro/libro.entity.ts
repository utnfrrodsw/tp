import {
  Entity,
  OneToMany,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  ManyToOne,
} from "@mikro-orm/core";
import { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";

import { Autor } from "../autor/autor.entity.js";
import { Editorial } from "../editorial/editorial.entity.js";

@Entity()
export class Libro extends BaseEntity {
  @Property()
  titulo!: string;

  @Property()
  descripcion!: string;

  @Property()
  isbn!: string;

  @ManyToOne(() => Autor)
  miAutor!: Rel<Autor>;

  @ManyToMany(() => Editorial, (editorial) => editorial.misLibros, {
    owner: true,
    //deleteRule: "cascade",
    //updateRule: "cascade",
  })
  misEditoriales = new Collection<Editorial>(this);
}

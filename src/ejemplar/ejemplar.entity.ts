import {
  Entity,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  BeforeDelete,
  EventArgs,
  OneToMany,
  PrimaryKey,
  DateTimeType,
  ManyToOne,
  Rel,
} from "@mikro-orm/core";
import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Ejemplar {
  @PrimaryKey()
  idEjemplar?: number; // Revisar el ?

  @ManyToOne(() => Libro, { primary: true })
  miLibro!: Rel<Libro>;

  @Property({ type: DateTimeType })
  createdAt? = new Date();
}

import {
  Entity,
  Property,
  PrimaryKey,
  DateType,
  ManyToOne,
  Rel,
  PrimaryKeyProp,
} from "@mikro-orm/core";
import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Ejemplar {
  @PrimaryKey()
  id!: number; // Tiene que llegar un ID si o si al insert en la DB. No hereda de la BaseEntity por ser "obligatorio".

  @ManyToOne(() => Libro, { primary: true })
  miLibro!: Rel<Libro>;

  [PrimaryKeyProp]?: ["id", "miLibro"]; // Indica a TS que esta es la CP.

  @Property({ type: DateType })
  fechaIncorporacion? = new Date();
}

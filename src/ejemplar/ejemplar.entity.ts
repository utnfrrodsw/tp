import {
  Entity,
  Property,
  PrimaryKey,
  DateType,
  ManyToOne,
  Rel,
  PrimaryKeyProp,
  Collection,
  OneToMany,
} from "@mikro-orm/core";
import { Libro } from "../libro/libro.entity.js";
import { LineaPrestamo } from "../lineaPrestamo/lineaPrestamo.entity.js";

@Entity()
export class Ejemplar {
  @PrimaryKey()
  id!: number; // Tiene que llegar un ID si o si al insert en la DB. No hereda de la BaseEntity por ser "obligatorio".

  @ManyToOne(() => Libro, { primary: true })
  miLibro!: Rel<Libro>;

  [PrimaryKeyProp]?: ["id", "miLibro"]; // Indica a TS que esta es la CP.

  @Property({ type: DateType })
  fechaIncorporacion? = new Date();

  @OneToMany(() => LineaPrestamo, (lp) => lp.miEjemplar, {})
  misLp = new Collection<LineaPrestamo>(this);

  getLibro(): Libro {
    return this.miLibro;
  }
  esTuLibro(libro: Libro): boolean {
    return this.miLibro === libro; // No se si va a funcionar, porque uno viene del back y otro del front.
  }

  estasPendiente(): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misLp.length && rta != true) {
      rta = this.misLp[i].estasPendiente();
      i++;
    }
    return rta;
  }
  getLpPendiente(): LineaPrestamo {
    const lpPendiente = this.misLp.find((lp) => lp.estasPendiente());
    if (!lpPendiente) {
      throw new Error("No se encontró ninguna línea de préstamo pendiente");
    }
    return lpPendiente;
    //En el contexto de uso de la función, esto deberia devolver una LP siempre. Contemplar crear un error especifico.
  }
}

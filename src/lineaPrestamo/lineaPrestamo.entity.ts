import {
  Entity,
  ManyToOne,
  Property,
  DateType,
  Rel,
  PrimaryKey,
  PrimaryKeyProp,
} from "@mikro-orm/core";

import { Prestamo } from "../prestamo/prestamo.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { isBefore } from "date-fns";

@Entity()
export class LineaPrestamo {
  @PrimaryKey()
  ordenLinea!: number;

  @ManyToOne(() => Prestamo, {
    primary: true,
    hidden: true,
    deleteRule: "cascade",
  })
  miPrestamo!: Rel<Prestamo>;

  [PrimaryKeyProp] = ["ordenLinea", "miPrestamo"];

  @Property({ type: DateType })
  fechaDevolucionTeorica!: Date;

  @Property({ nullable: true, type: DateType })
  fechaDevolucionReal?: Date;

  @ManyToOne(() => Ejemplar)
  miEjemplar!: Rel<Ejemplar>;

  tenesPendiente(libro: Libro): boolean {
    if (!this.estasPendiente()) {
      return false;
    }
    const rta = this.miEjemplar.esTuLibro(libro);
    return rta;
  }
  estasPendiente(): boolean {
    return this.fechaDevolucionReal === null;
  }

  estasAtrasado(): boolean {
    if (!this.fechaDevolucionReal) {
      const hoy = new Date();
      return !isBefore(hoy, this.fechaDevolucionTeorica);
    }
    return isBefore(this.fechaDevolucionReal, this.fechaDevolucionTeorica);
  }
  setFechaDevolucionReal(fecha: Date): void {
    this.fechaDevolucionReal = fecha;
  }
  getFechaDevolucionTeorica(): Date {
    return this.fechaDevolucionTeorica;
  }
  getEjemplar(): Ejemplar {
    return this.miEjemplar;
  }
  getPrestamo(): Prestamo {
    return this.miPrestamo;
  }
}

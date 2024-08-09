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

  @ManyToOne(() => Prestamo, { primary: true })
  miPrestamo!: Rel<Prestamo>;

  [PrimaryKeyProp] = ["ordenLinea", "miPrestamo"];

  @Property({ type: DateType })
  fechaDevolucionTeorica!: Date;

  @Property({ nullable: true, type: DateType })
  fechaDevolucionReal?: Date;

  @ManyToOne(() => Ejemplar)
  miEjemplar!: Rel<Ejemplar>;

  tenesPendiente(libro: Libro): boolean {
    if (this.estasPendiente()) {
      return false;
    }
    const rta = this.miEjemplar.esTuLibro(libro);
    return rta;
  }
  estasPendiente(): boolean {
    return this.fechaDevolucionReal === null;
  }
  seDevolvioATiempo(): boolean {
    const hoy = new Date();

    return isBefore(hoy, this.fechaDevolucionTeorica);
  }
  setFechaDevolucionReal(fecha: Date): void {
    this.fechaDevolucionReal = fecha;
  }
  getFechaDevolucionTeorica(): Date {
    return this.fechaDevolucionTeorica;
  }
  toJSON(includeEjemplar = true) {
    const json: any = {
      ordenLinea: this.ordenLinea,
      fechaDevolucionTeorica: this.fechaDevolucionTeorica,
      fechaDevolucionReal: this.fechaDevolucionReal,
      // Puedes agregar más propiedades si es necesario
    };

    if (includeEjemplar) {
      json.miEjemplar = this.miEjemplar.toJSON(false);
    }

    return json;
  }
}

import {
  Entity,
  ManyToOne,
  Property,
  DateType,
  Rel,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { Socio } from "../socio/socio.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { LineaPrestamo } from "../lineaPrestamo/lineaPrestamo.entity.js";

import { Libro } from "../libro/libro.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";

@Entity()
export class Prestamo extends BaseEntity {
  @Property({ type: DateType })
  fechaPrestamo = new Date();
  @Property({ hidden: true })
  ordenLinea = 0;

  @ManyToOne(() => Socio)
  miSocioPrestamo!: Rel<Socio>;

  @OneToMany(() => LineaPrestamo, (lp) => lp.miPrestamo, {})
  misLpPrestamo = new Collection<LineaPrestamo>(this);

  tenesPendiente(libro: Libro): boolean {
    let i = 0;
    let rta = false;
    while (rta != true && i < this.misLpPrestamo.length) {
      rta = this.misLpPrestamo[i].tenesPendiente(libro);
      i++;
    }
    return rta;
  }
  getOrdenLinea(): number {
    this.ordenLinea++;
    return this.ordenLinea;
  }
  getCantPendientes(): number {
    let contador = 0;
    for (const lp of this.misLpPrestamo) {
      if (lp.estasPendiente()) {
        contador++;
      }
    }
    return contador;
  }
  estasAtrasado(): boolean {
    let i = 0;
    let rta = false;
    while (rta != true && i < this.misLpPrestamo.length) {
      rta = this.misLpPrestamo[i].estasAtrasado();
      i++;
    }
    return rta;
  }
  getNoDevueltos(): Ejemplar[] {
    const noDevueltos = [];
    for (const lp of this.misLpPrestamo) {
      if (lp.estasPendiente()) {
        const ejemplar = lp.getEjemplar();
        noDevueltos.push(ejemplar);
      }
    }
    return noDevueltos;
  }
}

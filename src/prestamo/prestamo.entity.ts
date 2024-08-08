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

@Entity()
export class Prestamo extends BaseEntity {
  @Property({ type: DateType })
  fechaPrestamo = new Date();
  @Property()
  ordenLinea = 0;

  @ManyToOne(() => Socio)
  miSocio!: Rel<Socio>;

  @OneToMany(() => LineaPrestamo, (lp) => lp.miPrestamo, {})
  misLp = new Collection<LineaPrestamo>(this);

  //constructor para instancia que no persisto

  constructor(
    id: number,
    ordenLinea: number,
    miSocio: Socio,
    misLp: LineaPrestamo[]
  ) {
    super();
    this.id = id;
    this.ordenLinea = ordenLinea;
    this.miSocio = miSocio;
    this.misLp = misLp; // Revisar
  }

  tenesPendiente(libro: Libro): boolean {
    let i = 0;
    let rta = false;
    while (rta != true && i < this.misLp.length) {
      rta = this.misLp[i].tenesPendiente(libro);
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
    for (const lp of this.misLp) {
      if (lp.estasPendiente()) {
        contador++;
      }
    }
    return contador;
  }
}

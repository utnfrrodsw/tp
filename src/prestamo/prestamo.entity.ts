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
import { Type, Exclude } from "class-transformer";
import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Prestamo extends BaseEntity {
  @Property({ type: DateType })
  fechaPrestamo = new Date();
  @Property()
  ordenLinea = 0;

  @ManyToOne(() => Socio)
  @Type(() => Socio)
  miSocio!: Rel<Socio>;

  @OneToMany(() => LineaPrestamo, (lp) => lp.miPrestamo, {})
  @Type(() => LineaPrestamo)
  misLp = new Collection<LineaPrestamo>(this);

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

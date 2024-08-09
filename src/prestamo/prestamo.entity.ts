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
import { Type, Exclude, Expose } from "class-transformer";
import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Prestamo extends BaseEntity {
  @Property({ type: DateType })
  @Expose()
  fechaPrestamo = new Date();
  @Property()
  @Expose()
  ordenLinea = 0;

  @ManyToOne(() => Socio)
  @Type(() => Socio)
  @Expose()
  miSocioPrestamo!: Rel<Socio>;

  @OneToMany(() => LineaPrestamo, (lp) => lp.miPrestamo, {})
  @Type(() => LineaPrestamo)
  @Expose()
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
  toJSON(includeSocio = true) {
    const json: any = {
      id: this.id,
      fechaPrestamo: this.fechaPrestamo,
      ordenLinea: this.ordenLinea,
      misLpPrestamo: Array.from(this.misLpPrestamo).map((lp) =>
        lp.toJSON(false)
      ),
    };

    if (includeSocio) {
      json.miSocioPrestamo = this.miSocioPrestamo.toJSON(false);
    }

    return json;
  }
}

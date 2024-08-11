import { Entity, ManyToOne, Property, DateType, Rel } from "@mikro-orm/core";
import { Socio } from "../socio/socio.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { addDays, isBefore } from "date-fns";

@Entity()
export class Sancion extends BaseEntity {
  @Property({ type: DateType })
  fechaSancion = new Date();

  @Property()
  diasSancion!: number;

  @ManyToOne(() => Socio, { deleteRule: "cascade" })
  miSocioSancion!: Rel<Socio>;

  getFechaFinSancion(): Date {
    return addDays(this.fechaSancion, this.diasSancion);
  }

  estasVigente(): boolean {
    const hoy = new Date();

    return isBefore(this.getFechaFinSancion(), hoy);
  }
  getDiasSancion(): number {
    return this.diasSancion;
  }
}

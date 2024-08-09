import { Entity, ManyToOne, Property, DateType, Rel } from "@mikro-orm/core";
import { Socio } from "../socio/socio.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { addDays, isBefore } from "date-fns";
import { Type, Expose } from "class-transformer";

@Entity()
export class Sancion extends BaseEntity {
  @Property({ type: DateType })
  @Expose()
  fechaSancion = new Date(); // Por ahora solo se contempla un create automatico dentro del CU "Devolver libros".

  @Property()
  @Expose()
  diasSancion!: number;

  @ManyToOne(() => Socio)
  @Type(() => Socio)
  @Expose()
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
  toJSON(includeSocio = false) {
    const json: any = {
      id: this.id,
      fechaSancion: this.fechaSancion,
      diasSancion: this.diasSancion,
      fechaFinSancion: this.getFechaFinSancion(),
      vigente: this.estasVigente(),
    };

    if (includeSocio) {
      json.miSocioSancion = this.miSocioSancion.toJSON(false);
    }

    return json;
  }
}

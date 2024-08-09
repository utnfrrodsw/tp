import { Entity, Property, Collection, OneToMany } from "@mikro-orm/core";
import { Prestamo } from "../prestamo/prestamo.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Sancion } from "../sancion/sancion.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { Type } from "class-transformer";

@Entity()
export class Socio extends BaseEntity {
  @Property()
  nombre!: string;
  @Property()
  apellido!: string;
  @Property()
  email!: string;
  @Property()
  domicilio!: string;
  @Property()
  telefono!: string;
  @Property() // Analizar si deberia ser hidden
  estadoSocio?: string = "Habilitado";

  @OneToMany(() => Prestamo, (prestamo) => prestamo.miSocio, {})
  @Type(() => Prestamo)
  misPrestamos = new Collection<Prestamo>(this);

  @OneToMany(() => Sancion, (sancion) => sancion.miSocio, {})
  @Type(() => Sancion)
  misSanciones = new Collection<Sancion>(this);

  //Metodos

  estasHabilitado(): boolean {
    return this.estadoSocio === "Habilitado";
  }

  estasSancionado(): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misSanciones.length && rta != true) {
      rta = this.misSanciones[i].estasVigente();
      i++;
    }
    return rta;
  }
  // Versión depurada con recomendaciones de la IA
  getDiasSancion(): number {
    let acumulador = 0;

    for (const sancion of this.misSanciones) {
      if (sancion.estasVigente()) {
        acumulador += sancion.getDiasSancion();
      }
    }

    return acumulador;
  }

  tenesPendiente(libro: Libro): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misPrestamos.length && rta != true) {
      rta = this.misPrestamos[i].tenesPendiente(libro);
      i++;
    }

    return rta;
  }

  getCantPendientes() {
    let acumulador = 0;
    for (const prestamo of this.misPrestamos) {
      acumulador += prestamo.getCantPendientes();
    }
    return acumulador;
  }
}

import { Entity, Property, Collection, OneToMany } from "@mikro-orm/core";
import { Prestamo } from "../prestamo/prestamo.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Sancion } from "../sancion/sancion.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { Type, Expose } from "class-transformer";

@Entity()
export class Socio extends BaseEntity {
  @Property()
  @Expose()
  nombre!: string;
  @Property()
  @Expose()
  apellido!: string;
  @Property()
  @Expose()
  email!: string;
  @Property()
  @Expose()
  domicilio!: string;
  @Property()
  @Expose()
  telefono!: string;
  @Property() // Analizar si deberia ser hidden
  @Expose()
  estadoSocio?: string = "Habilitado";

  @OneToMany(() => Prestamo, (prestamo) => prestamo.miSocioPrestamo, {})
  @Type(() => Prestamo)
  @Expose()
  misPrestamos = new Collection<Prestamo>(this);

  @OneToMany(() => Sancion, (sancion) => sancion.miSocioSancion, {})
  @Type(() => Sancion)
  @Expose()
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
  toJSON(includePrestamosSanciones = true) {
    const json: any = {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      domicilio: this.domicilio,
      telefono: this.telefono,
      estadoSocio: this.estadoSocio,
    };

    if (includePrestamosSanciones) {
      json.misPrestamos = this.misPrestamos.isInitialized()
        ? this.misPrestamos.getItems().map((p) => p.toJSON(false))
        : [];
      json.misSanciones = this.misSanciones.isInitialized()
        ? this.misSanciones.getItems().map((s) => s.toJSON())
        : [];
    }

    return json;
  }
}

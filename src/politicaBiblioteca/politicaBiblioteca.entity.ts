import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";

@Entity()
export class PoliticaBiblioteca extends BaseEntity {
  // MikroOrm obliga a que tenga CP. De todas formas es una clase de una instancia. Dejo el id Autogenerado de la base entity.

  @Property()
  diasSancionMaxima!: number; // Sancion aplicada si no se encuentra politicaSancion

  @Property()
  diasPrestamo!: number; // Dias por los que se presta un libro

  @Property()
  cantPendientes!: number; // Cantidad de libros maximos pendientes
}

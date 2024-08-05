import {
  Entity,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  BeforeDelete,
  EventArgs,
  OneToMany,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";

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
}

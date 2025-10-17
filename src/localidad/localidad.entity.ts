import { Entity, Property, OneToMany, ManyToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Ciudad } from "../ciudad/ciudad.entity.js";
import { Beneficio } from "../beneficios/beneficios.entity.js";
import { persona } from "../personas/personas.entity.js";
@Entity()
export class Localidad extends BaseEntity {
  @Property({ nullable: false })
  nombre_localidad!: string;

  @Property({ nullable: false, default: "Argentina" })
  pais!: string;

  // Una provincia (localidad) puede tener muchas ciudades
  @OneToMany(() => Ciudad, (ciudad) => ciudad.localidad, {
    cascade: [Cascade.ALL],
  })
  ciudades = new Collection<Ciudad>(this);

  @OneToMany(() => persona, (persona) => persona.localidad, {
    cascade: [Cascade.ALL],
  })
  personas = new Collection<persona>(this);
  // Una provincia puede estar asociada a muchos beneficios, y un beneficio puede aplicar en muchas provincias
  @ManyToMany(() => Beneficio, (beneficio) => beneficio.localidades)
  beneficios = new Collection<Beneficio>(this);
}

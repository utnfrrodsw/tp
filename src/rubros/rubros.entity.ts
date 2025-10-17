import { Entity, OneToMany, Property ,Cascade,Collection} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Beneficio } from "../beneficios/beneficios.entity.js";

@Entity()
export class Rubro extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

 @OneToMany(() => Beneficio, (beneficio) => beneficio.rubro, {
    cascade: [Cascade.ALL],
  })
  beneficios = new Collection<Beneficio>(this);
}
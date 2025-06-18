import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Tarea extends BaseEntity {
  @Property()
  nombreTarea!: string
  @Property()
  descripcionTarea!: string
  @Property()
  duracionTarea!: number
// many to many esta necesita una tabla intermedia para poder poner los atributos 
//@ManytoMany(() => Usuario,(),{nullable: true})
// usuarios?: Rel<Usuario>
//@ManyToOne(() => TipoServicio, { nullable: true, cascade: [Cascade.ALL] })
// tipoServicio?: Rel<TipoServicio>
}

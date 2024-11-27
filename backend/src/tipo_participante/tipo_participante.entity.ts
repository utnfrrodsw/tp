import { Cascade, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { Participante } from "../participante/participante.entity.js"


@Entity()
export class Tipo_participante {

  @Property({nullable: false})
  posicion!: string

  @PrimaryKey({unique: true})
  id!: number

  @OneToMany(() => Participante, participante => participante.tipos_par, {cascade: [Cascade.ALL]})
  participantes = new Collection<Participante>(this)

}
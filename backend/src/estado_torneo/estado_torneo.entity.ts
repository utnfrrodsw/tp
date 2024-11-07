import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property, } from "@mikro-orm/core"
import { Torneo } from "../torneo/torneo.entity.js"

@Entity()
export class Estado_torneo {

    @Property({nullable: false})
    nombre_estado!: string

    @PrimaryKey({unique: true})
    id!: number

    @OneToMany(() => Torneo, torneo => torneo.estado_torneo, {cascade: [Cascade.ALL]})
    torneos = new Collection<Torneo>(this)

}
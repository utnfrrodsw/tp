import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property, } from "@mikro-orm/core"
import { Torneo } from "../torneo/torneo.entity.js"

@Entity()
export class Formatos_torneo{

    @PrimaryKey({unique: true})
    id!:number

    @Property({nullable: false})
    cant_grupos!:number

    @Property({nullable: false})
    cant_equipos_x_grupo!:number

    @Property({nullable: false})
    cant_clasificados_x_grupo!:number

    @OneToMany(() => Torneo, torneo => torneo.formato_torneo, {cascade: [Cascade.ALL]})
    torneos = new Collection<Torneo>(this)

}
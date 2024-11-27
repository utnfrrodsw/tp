import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property, Rel, } from "@mikro-orm/core"
import { Torneo } from "../torneo/torneo.entity.js"
import { Equipo } from "../equipo/equipo.entity.js"

@Entity()
export class Partido{

    @Property({nullable: true})
    fecha!: string

    @Property({nullable: true})
    ganador!: number

    @PrimaryKey({unique: true})
    id!: number
    
    @ManyToOne(() => Torneo)
    torneo!: Rel<Torneo>;

    @ManyToMany(() => Equipo, equipo => equipo.partidos, {nullable:true})
    equipos = new Collection<Equipo>(this)
    
}
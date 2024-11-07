import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property, Rel, } from "@mikro-orm/core"
import { Torneo } from "../torneo/torneo.entity.js"
import { Equipo } from "../equipo/equipo.entity.js"

@Entity()
export class Partido{

    @Property({nullable: false})
    fecha!: string

    @PrimaryKey({unique: true})
    id!: number
    
    @ManyToOne(() => Torneo)
    torneo!: Rel<Torneo>;

    @ManyToMany(() => Equipo, equipo => equipo.partidos)
    equipos = new Collection<Equipo>(this)
    
}


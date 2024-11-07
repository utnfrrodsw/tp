import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, Rel, } from "@mikro-orm/core"
import { Participante } from "../participante/participante.entity.js"
import { Partido } from "../partido/partido.entity.js";
import { Torneo } from "../torneo/torneo.entity.js"

@Entity()
export class Equipo{
    
    @PrimaryKey({unique: true})
    id!: number

    @ManyToMany(() => Participante, participante => participante.equipos, {
        cascade: [Cascade.ALL],
        owner: true
    })
    participantes = new Collection<Participante>(this);

    @ManyToMany(() => Partido, partido => partido.equipos, {
        cascade: [Cascade.ALL],
        owner: true
    })
    partidos = new Collection<Partido>(this)
    
    @ManyToOne(() => Torneo)
    torneo!: Rel<Torneo>
}

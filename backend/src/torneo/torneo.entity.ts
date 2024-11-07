import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { Equipo } from "../equipo/equipo.entity.js"
import { Partido } from "../partido/partido.entity.js"
import { Admin } from "../admin/admin.entity.js"
import { Sucursal } from "../sucursal/sucursal.entity.js"
import { Estado_torneo } from "../estado_torneo/estado_torneo.entity.js"
import { Formatos_torneo } from "../formatos_torneo/formatos_torneo.entity.js"

@Entity()
export class Torneo{

    @Property({nullable: false})
    nombre_torneo!: string

    @Property({nullable: false})
    fecha_inico_insc!: string

    @Property({nullable: false})
    fecha_fin_insc!: string

    @Property({nullable: false})
    fecha_inicio_torneo!: string

    @Property({nullable: false})
    fecha_fin_torneo!: string

    @Property({nullable: true})
    ganador!: string

    @PrimaryKey({unique: true})
    id!: number
    
    @OneToMany(() => Equipo, equipo => equipo.torneo, {cascade: [Cascade.ALL]})
    equipos = new Collection<Equipo>(this)
    
    @OneToMany(() => Partido, partido => partido.torneo, {cascade: [Cascade.ALL]})
    partidos = new Collection<Partido>(this)
    
    @ManyToOne(() => Admin)
    admin!: Rel<Admin>
    
    @ManyToOne(() => Sucursal)
    sucursal!: Rel<Sucursal>

    @ManyToOne(() => Estado_torneo)
    estado_torneo!: Rel<Estado_torneo>

    @ManyToOne(() => Formatos_torneo)
    formato_torneo!: Rel<Formatos_torneo>

}
import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel, } from "@mikro-orm/core"
import { Torneo } from "../torneo/torneo.entity.js"
import { Localidad } from "../localidades/localidades.entity.js"

@Entity()
export class Sucursal{

    @Property({nullable: false})
    nombre_sucursal!: string

    @PrimaryKey({unique: true})
    id!: number

    @OneToMany(() => Torneo, torneo => torneo.sucursal, {cascade: [Cascade.ALL]})
    torneos = new Collection<Torneo>(this)
    

    @ManyToOne(() => Localidad)
    localidad!: Rel<Localidad>
    
}
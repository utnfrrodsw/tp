import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { Sucursal } from "../sucursal/sucursal.entity.js"

@Entity()
export class Localidad{

    @Property({nullable: false, unique: true})
    public nombre_localidad!: string

    @PrimaryKey({unique: true})
    public id !: number

    @OneToMany(() => Sucursal, sucursal => sucursal.localidad, {cascade: [Cascade.ALL]})
    sucursales = new Collection<Sucursal>(this)

}
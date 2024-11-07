import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { Torneo } from "../torneo/torneo.entity.js"

@Entity()
export class Admin{

    @Property({nullable: false})
    nombre!:string

    @Property({nullable: false})
    contraseña!:string

    @Property({nullable: false})
    apellido!:string

    @Property({nullable: false})
    mail!:string

    @Property({nullable: false})
    fecha_nacimiento!:string

    @PrimaryKey({unique: true})
    id!: number

    @OneToMany(() => Torneo, torneo => torneo.admin, {cascade: [Cascade.ALL]})
    torneos = new Collection<Torneo>(this);

}
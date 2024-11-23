import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, Rel, } from "@mikro-orm/core"
import { Tipo_participante } from "../tipo_participante/tipo_participante.entity.js"
import { Equipo } from "../equipo/equipo.entity.js"

@Entity()
export class Participante{

    @Property({nullable: false})
    nombre!:string

    @Property({nullable: false})
    contraseña!:string

    @Property({nullable: false})
    apellido!:string

    @Property({nullable: false, unique: true})
    mail!:string

    @Property({nullable: false, type: Date})
    fecha_nacimiento!:string

    @Property({nullable: false})
    rol!: string

    @PrimaryKey({unique: true})
    id!: number

    @ManyToOne(() => Tipo_participante)
    tipos_par!: Rel<Tipo_participante>

    @ManyToMany(() => Equipo, equipo => equipo.participantes)
    equipos = new Collection<Equipo>(this);
    
}


import {
    PrimaryKey,
    Entity,
    Property,
    ManyToMany,
    Cascade,
    ManyToOne,
    Rel,
    Collection,
  } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";

@Entity()
export class Pacientes extends BaseEntity {

    @Property({ nullable: false })
    dni!: string;
    
    @Property({ nullable: false })
    tipoDni!: string;
    
    @Property({ nullable: false })
    nombre!: string;

    @Property({ nullable: false })
    apellido!: string;

    @Property({ nullable: false })
    direccion!: string;
  
    @Property({ nullable: false })
    telefono!: string;
  
    @Property({ nullable: false })
    idLocalidad!: string;
  
}
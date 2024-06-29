import {
    PrimaryKey,
    SerializedPrimaryKey,
    Entity,
    Property,
    ManyToMany,
    Cascade,
    ManyToOne,
    Rel,
    Collection,
} from "@mikro-orm/core";
import { Especialidades } from "../especialidades/especialidades.entity.js";
import { BaseEntity } from "../../shared/baseEntity.entity.js";

@Entity()
export class Medicos extends BaseEntity {

    @Property({ nullable: false })
    matricula!: string;
    
    @Property({ nullable: false })
    nombre!: string;

    @Property({ nullable: false })
    apellido!: string;

    @Property({ nullable: false })
    telefono!: string;
  
    @Property({ nullable: false })
    idEspecialidad!: string;
  
    @Property({ nullable: false })
    horaDesde!: string;
    
    @Property({ nullable: false })
    horaHasta!: string;
  
    @Property({ nullable: false })
    diasAtencion!: string;
  
    @ManyToOne(() => Especialidades, { nullable: false })
      Especialidades!: Rel<Especialidades>
  
  }
  
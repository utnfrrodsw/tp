import { Entity, Property, ManyToMany, Cascade, ManyToOne,Rel, OneToMany, Collection} from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'
import { Specialty } from '../specialty/specialty.entity.js'  
import { Follow_up } from '../follow_up/follow_up.entity.js'  
  
@Entity()
export class User extends BaseEntity {
    @Property({ nullable: false })
    firstName!: string
  
    @Property({ nullable: false })
    lastName!: string
  
    @Property({ nullable: false })
    email!: string
  
    @Property({ nullable: false })
    password!: string
  
    @Property({ nullable: false })
    age!: number
  
    @Property({ nullable: true })
    tuition_number!: number
  
    @Property({ nullable: false})
    cod_user!: number

    @ManyToOne(() => Specialty, {nullable: false})
    specialty!: Rel<Specialty>;

    @OneToMany(() => Follow_up, (follow_up)=> follow_up.patient, {
      cascade: [Cascade.ALL]
    })
    follow_up = new Collection<User>(this);
    //appointments
  }
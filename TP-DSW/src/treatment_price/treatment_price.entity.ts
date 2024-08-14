import { Entity, ManyToOne, Property, Rel} from '@mikro-orm/core'
import { Treatment } from '../treatment/treatment.entity.js'
import { BaseEntity } from '../shared/baseEntity.entity.js'

@Entity()
  export class Treatment_price extends BaseEntity{

    @Property({ nullable: false })
    vigDate!: Date
  
    @Property({ nullable: false })
    cost!: number

    @ManyToOne(() => Treatment, {nullable: false})
    treatment !: Rel<Treatment>

  }
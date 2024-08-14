import { Entity, Property, ManyToMany, Cascade, ManyToOne, Rel,Collection} from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { Treatment } from '../treatment/treatment.entity.js'
import { BaseEntity } from '../shared/baseEntity.entity.js'
@Entity()
export class Follow_up extends BaseEntity{
  @Property({ nullable: false })
  fdate!: Date

  @Property({ nullable: true })
  observations!: string

  @ManyToOne(() => User, {nullable: false})
  patient!: Rel<User>

  @ManyToMany(() => Treatment, (treatment)=> treatment.follow_ups)
  treatments = new Collection<Treatment>(this);
}
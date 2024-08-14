import { Cascade, Collection, Entity, Property,OneToMany, ManyToMany } from "@mikro-orm/core";
import { Treatment_price } from "../treatment_price/treatment_price.entity.js";
import { Follow_up } from "../follow_up/follow_up.entity.js";
import { BaseEntity } from "../shared/baseEntity.entity.js";

@Entity()
export class Treatment extends BaseEntity{
  //id: number,
  @Property({nullable: false, unique: true})
  name!: string
  @Property()
  description!: string
  @OneToMany(() => Treatment_price, (price) => price.treatment, {
    cascade: [Cascade.ALL]
  })
  prices = new Collection<Treatment_price>(this);

  @ManyToMany(() => Follow_up, (follow_up) => follow_up.treatments, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  follow_ups !: Follow_up[]
}
import { Entity, Property, Collection, OneToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";
import { User } from "../user/user.entity.js";
import { Specialty_price } from "../specialty_price/specialty_price.entity.js";

@Entity()
export class Specialty extends BaseEntity{
    @Property({nullable: false, unique: true})
    name!: string

    @OneToMany(() => User, (user) => user.specialty, {
        cascade: [Cascade.ALL],
    })
    doctors = new Collection<User>(this);

    @OneToMany(() => Specialty_price, (price) => price.specialty, {
        cascade: [Cascade.ALL],
    })
    prices = new Collection<Specialty_price>(this);
}
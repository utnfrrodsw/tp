var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, Collection, OneToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";
import { User } from "../user/user.entity.js";
import { Specialty_price } from "../specialty_price/specialty_price.entity.js";
export let Specialty = class Specialty extends BaseEntity {
    constructor() {
        super(...arguments);
        this.doctors = new Collection(this);
        this.prices = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Specialty.prototype, "name", void 0);
__decorate([
    OneToMany(() => User, (user) => user.specialty, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Specialty.prototype, "doctors", void 0);
__decorate([
    OneToMany(() => Specialty_price, (price) => price.specialty, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Specialty.prototype, "prices", void 0);
Specialty = __decorate([
    Entity()
], Specialty);
//# sourceMappingURL=specialty.entity.js.map
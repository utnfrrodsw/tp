var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, Cascade, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Specialty } from '../specialty/specialty.entity.js';
import { Follow_up } from '../follow_up/follow_up.entity.js';
export let User = class User extends BaseEntity {
    constructor() {
        super(...arguments);
        this.follow_up = new Collection(this);
        //appointments
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "tuition_number", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "cod_user", void 0);
__decorate([
    ManyToOne(() => Specialty, { nullable: false }),
    __metadata("design:type", Object)
], User.prototype, "specialty", void 0);
__decorate([
    OneToMany(() => Follow_up, (follow_up) => follow_up.patient, {
        cascade: [Cascade.ALL]
    }),
    __metadata("design:type", Object)
], User.prototype, "follow_up", void 0);
User = __decorate([
    Entity()
], User);
//# sourceMappingURL=user.entity.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Specialty } from '../specialty/specialty.entity.js';
import { BaseEntity } from '../shared/baseEntity.entity.js';
export let Specialty_price = class Specialty_price extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Specialty_price.prototype, "vigDate", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Specialty_price.prototype, "cost", void 0);
__decorate([
    ManyToOne(() => Specialty, { nullable: false }),
    __metadata("design:type", Object)
], Specialty_price.prototype, "specialty", void 0);
Specialty_price = __decorate([
    Entity()
], Specialty_price);
//# sourceMappingURL=specialty_price.entity.js.map
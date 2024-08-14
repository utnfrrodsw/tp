var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Treatment } from '../treatment/treatment.entity.js';
import { BaseEntity } from '../shared/baseEntity.entity.js';
export let Treatment_price = class Treatment_price extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Treatment_price.prototype, "vigDate", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Treatment_price.prototype, "cost", void 0);
__decorate([
    ManyToOne(() => Treatment, { nullable: false }),
    __metadata("design:type", Object)
], Treatment_price.prototype, "treatment", void 0);
Treatment_price = __decorate([
    Entity()
], Treatment_price);
//# sourceMappingURL=treatment_price.entity.js.map
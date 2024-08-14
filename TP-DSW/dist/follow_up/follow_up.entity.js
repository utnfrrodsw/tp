var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToMany, ManyToOne, Collection } from '@mikro-orm/core';
import { User } from '../user/user.entity.js';
import { Treatment } from '../treatment/treatment.entity.js';
import { BaseEntity } from '../shared/baseEntity.entity.js';
export let Follow_up = class Follow_up extends BaseEntity {
    constructor() {
        super(...arguments);
        this.treatments = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Follow_up.prototype, "fdate", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Follow_up.prototype, "observations", void 0);
__decorate([
    ManyToOne(() => User, { nullable: false }),
    __metadata("design:type", Object)
], Follow_up.prototype, "patient", void 0);
__decorate([
    ManyToMany(() => Treatment, (treatment) => treatment.follow_ups),
    __metadata("design:type", Object)
], Follow_up.prototype, "treatments", void 0);
Follow_up = __decorate([
    Entity()
], Follow_up);
//# sourceMappingURL=follow_up.entity.js.map
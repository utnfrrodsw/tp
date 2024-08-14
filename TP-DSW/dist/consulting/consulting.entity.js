var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";
export let Consulting = class Consulting extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Consulting.prototype, "street", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Consulting.prototype, "alt_street", void 0);
Consulting = __decorate([
    Entity()
], Consulting);
//# sourceMappingURL=consulting.entity.js.map
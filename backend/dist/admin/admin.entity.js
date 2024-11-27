var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Torneo } from "../torneo/torneo.entity.js";
let Admin = class Admin {
    constructor() {
        this.torneos = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Admin.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Admin.prototype, "contrase\u00F1a", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Admin.prototype, "apellido", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "mail", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Admin.prototype, "fecha_nacimiento", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Admin.prototype, "rol", void 0);
__decorate([
    PrimaryKey({ unique: true }),
    __metadata("design:type", Number)
], Admin.prototype, "id", void 0);
__decorate([
    OneToMany(() => Torneo, torneo => torneo.admin, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Admin.prototype, "torneos", void 0);
Admin = __decorate([
    Entity()
], Admin);
export { Admin };
//# sourceMappingURL=admin.entity.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property, } from "@mikro-orm/core";
import { Torneo } from "../torneo/torneo.entity.js";
export let Formatos_torneo = class Formatos_torneo {
    constructor() {
        this.torneos = new Collection(this);
    }
};
__decorate([
    PrimaryKey({ unique: true }),
    __metadata("design:type", Number)
], Formatos_torneo.prototype, "id", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Formatos_torneo.prototype, "cant_grupos", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Formatos_torneo.prototype, "cant_equipos_x_grupo", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Formatos_torneo.prototype, "cant_clasificados_x_grupo", void 0);
__decorate([
    OneToMany(() => Torneo, torneo => torneo.formato_torneo, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Formatos_torneo.prototype, "torneos", void 0);
Formatos_torneo = __decorate([
    Entity()
], Formatos_torneo);
//# sourceMappingURL=formatos_torneo.entity.js.map
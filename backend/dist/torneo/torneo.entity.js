var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Equipo } from "../equipo/equipo.entity.js";
import { Partido } from "../partido/partido.entity.js";
import { Admin } from "../admin/admin.entity.js";
import { Sucursal } from "../sucursal/sucursal.entity.js";
import { Estado_torneo } from "../estado_torneo/estado_torneo.entity.js";
import { Formatos_torneo } from "../formatos_torneo/formatos_torneo.entity.js";
export let Torneo = class Torneo {
    constructor() {
        this.equipos = new Collection(this);
        this.partidos = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Torneo.prototype, "nombre_torneo", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Torneo.prototype, "fecha_inico_insc", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Torneo.prototype, "fecha_fin_insc", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Torneo.prototype, "fecha_inicio_torneo", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Torneo.prototype, "fecha_fin_torneo", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Torneo.prototype, "ganador", void 0);
__decorate([
    PrimaryKey({ unique: true }),
    __metadata("design:type", Number)
], Torneo.prototype, "id", void 0);
__decorate([
    OneToMany(() => Equipo, equipo => equipo.torneo, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Torneo.prototype, "equipos", void 0);
__decorate([
    OneToMany(() => Partido, partido => partido.torneo, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Torneo.prototype, "partidos", void 0);
__decorate([
    ManyToOne(() => Admin),
    __metadata("design:type", Object)
], Torneo.prototype, "admin", void 0);
__decorate([
    ManyToOne(() => Sucursal),
    __metadata("design:type", Object)
], Torneo.prototype, "sucursal", void 0);
__decorate([
    ManyToOne(() => Estado_torneo),
    __metadata("design:type", Object)
], Torneo.prototype, "estado_torneo", void 0);
__decorate([
    ManyToOne(() => Formatos_torneo),
    __metadata("design:type", Object)
], Torneo.prototype, "formato_torneo", void 0);
Torneo = __decorate([
    Entity()
], Torneo);
//# sourceMappingURL=torneo.entity.js.map
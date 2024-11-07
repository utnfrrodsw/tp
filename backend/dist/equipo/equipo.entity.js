var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, } from "@mikro-orm/core";
import { Participante } from "../participante/participante.entity.js";
import { Partido } from "../partido/partido.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
export let Equipo = class Equipo {
    constructor() {
        this.participantes = new Collection(this);
        this.partidos = new Collection(this);
    }
};
__decorate([
    PrimaryKey({ unique: true }),
    __metadata("design:type", Number)
], Equipo.prototype, "id", void 0);
__decorate([
    ManyToMany(() => Participante, participante => participante.equipos, {
        cascade: [Cascade.ALL],
        owner: true
    }),
    __metadata("design:type", Object)
], Equipo.prototype, "participantes", void 0);
__decorate([
    ManyToMany(() => Partido, partido => partido.equipos, {
        cascade: [Cascade.ALL],
        owner: true
    }),
    __metadata("design:type", Object)
], Equipo.prototype, "partidos", void 0);
__decorate([
    ManyToOne(() => Torneo),
    __metadata("design:type", Object)
], Equipo.prototype, "torneo", void 0);
Equipo = __decorate([
    Entity()
], Equipo);
//# sourceMappingURL=equipo.entity.js.map
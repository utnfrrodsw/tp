var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property, } from "@mikro-orm/core";
import { Tipo_participante } from "../tipo_participante/tipo_participante.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";
export let Participante = class Participante {
    constructor() {
        this.equipos = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "contrase\u00F1a", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "apellido", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "mail", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "fecha_nacimiento", void 0);
__decorate([
    PrimaryKey({ unique: true }),
    __metadata("design:type", Number)
], Participante.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Tipo_participante),
    __metadata("design:type", Object)
], Participante.prototype, "tipos_par", void 0);
__decorate([
    ManyToMany(() => Equipo, equipo => equipo.participantes),
    __metadata("design:type", Object)
], Participante.prototype, "equipos", void 0);
Participante = __decorate([
    Entity()
], Participante);
//# sourceMappingURL=participante.entity.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, OneToMany, Property, Collection, Cascade, ManyToMany, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { Tarea } from '../tarea/tarea.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Turno } from '../turno/turno.entity.js';
export let Servicio = class Servicio {
    constructor() {
        this.usuarios = new Collection(this);
        this.turnos = new Collection(this);
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Servicio.prototype, "id", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Servicio.prototype, "precio", void 0);
__decorate([
    OneToOne(() => Tarea),
    __metadata("design:type", Object)
], Servicio.prototype, "tarea", void 0);
__decorate([
    ManyToMany(() => Usuario, (usuario) => usuario.servicios, { nullable: true, cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Servicio.prototype, "usuarios", void 0);
__decorate([
    OneToMany(() => Turno, turno => turno.servicio, { cascade: [Cascade.ALL], nullable: true }),
    __metadata("design:type", Object)
], Servicio.prototype, "turnos", void 0);
Servicio = __decorate([
    Entity()
], Servicio);
//# sourceMappingURL=servicio.entity.js.map
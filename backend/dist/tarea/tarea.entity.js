var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, OneToOne, Cascade, ManyToOne, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';
export let Tarea = class Tarea extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Tarea.prototype, "nombreTarea", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Tarea.prototype, "descripcionTarea", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Tarea.prototype, "duracionTarea", void 0);
__decorate([
    OneToOne(() => Servicio, (servicio) => servicio.tarea, {
        nullable: true,
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Tarea.prototype, "servicio", void 0);
__decorate([
    ManyToOne(() => TipoServicio, {
        nullable: false,
        cascade: [Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Tarea.prototype, "tipoServicio", void 0);
Tarea = __decorate([
    Entity()
], Tarea);
//# sourceMappingURL=tarea.entity.js.map
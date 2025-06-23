var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, PrimaryKey, Cascade, ManyToOne } from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
export let Turno = class Turno {
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Date)
], Turno.prototype, "fecha", void 0);
__decorate([
    PrimaryKey(),
    __metadata("design:type", String)
], Turno.prototype, "hora", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Turno.prototype, "estado", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Number)
], Turno.prototype, "calificacion", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Turno.prototype, "comentario", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Number)
], Turno.prototype, "montoFinal", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Date)
], Turno.prototype, "fechaPago", void 0);
__decorate([
    ManyToOne(() => Servicio, { cascade: [Cascade.ALL], nullable: true }),
    __metadata("design:type", Object)
], Turno.prototype, "servicio", void 0);
__decorate([
    ManyToOne(() => Usuario, { cascade: [Cascade.ALL], nullable: true }),
    __metadata("design:type", Object)
], Turno.prototype, "usuario", void 0);
Turno = __decorate([
    Entity()
], Turno);
//# sourceMappingURL=turno.entity.js.map
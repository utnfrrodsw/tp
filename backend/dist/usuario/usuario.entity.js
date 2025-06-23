var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, Cascade, ManyToMany, OneToMany, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';
import { Horario } from '../horario/horario.entity.js';
import { Zona } from '../zona/zona.entity.js';
export let Usuario = class Usuario extends BaseEntity {
    constructor() {
        super(...arguments);
        // Relación con Servicio
        this.servicios = new Collection(this);
        //Relación con Turno
        this.turnos = new Collection(this);
        //Relación con TipoServicio
        this.tiposDeServicio = new Collection(this);
        this.horarios = new Collection(this);
        this.zonas = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "mail", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "contrasena", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "tipoDoc", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Usuario.prototype, "numeroDoc", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Number)
], Usuario.prototype, "telefono", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "direccion", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombreFantasia", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "descripcion", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "foto", void 0);
__decorate([
    ManyToMany(() => Servicio, (servicio) => servicio.usuarios, {
        cascade: [Cascade.ALL],
        owner: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Usuario.prototype, "servicios", void 0);
__decorate([
    OneToMany(() => Turno, (turno) => turno.usuario, {
        cascade: [Cascade.ALL],
        nullable: true,
    }),
    __metadata("design:type", Object)
], Usuario.prototype, "turnos", void 0);
__decorate([
    ManyToMany(() => TipoServicio, (tipoServ) => tipoServ.users, {
        cascade: [Cascade.ALL],
        owner: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Usuario.prototype, "tiposDeServicio", void 0);
__decorate([
    OneToMany(() => Horario, (horario) => horario.usuario, {
        cascade: [Cascade.ALL],
        nullable: true,
    }),
    __metadata("design:type", Object)
], Usuario.prototype, "horarios", void 0);
__decorate([
    ManyToMany(() => Zona, (zona) => zona.usuarios, {
        cascade: [Cascade.ALL],
        nullable: false,
        owner: true,
    }),
    __metadata("design:type", Object)
], Usuario.prototype, "zonas", void 0);
Usuario = __decorate([
    Entity()
], Usuario);
//# sourceMappingURL=usuario.entity.js.map
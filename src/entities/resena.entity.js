var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/resena.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Libro } from './libro.entity';
import { Usuario } from './usuario.entity';
let Resena = class Resena {
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Resena.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Resena.prototype, "nombre", void 0);
__decorate([
    Property(),
    __metadata("design:type", Date)
], Resena.prototype, "fechaResena", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Resena.prototype, "comentario", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Resena.prototype, "calificacion", void 0);
__decorate([
    ManyToOne(() => Libro),
    __metadata("design:type", Libro)
], Resena.prototype, "libro", void 0);
__decorate([
    ManyToOne(() => Usuario),
    __metadata("design:type", Usuario)
], Resena.prototype, "usuario", void 0);
Resena = __decorate([
    Entity()
], Resena);
export { Resena };

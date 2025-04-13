var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/autor.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Libro } from './libro.entity';
let Autor = class Autor {
    constructor() {
        this.libros = new Collection(this);
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Autor.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Autor.prototype, "nombre", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Autor.prototype, "apellido", void 0);
__decorate([
    OneToMany(() => Libro, libro => libro.autor),
    __metadata("design:type", Object)
], Autor.prototype, "libros", void 0);
Autor = __decorate([
    Entity()
], Autor);
export { Autor };

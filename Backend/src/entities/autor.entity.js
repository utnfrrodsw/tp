"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autor = void 0;
// src/entities/autor.entity.ts
const core_1 = require("@mikro-orm/core");
const libro_entity_1 = require("./libro.entity");
let Autor = class Autor {
    constructor() {
        this.libros = new core_1.Collection(this);
    }
};
exports.Autor = Autor;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Autor.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Autor.prototype, "nombre", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Autor.prototype, "apellido", void 0);
__decorate([
    (0, core_1.OneToMany)(() => libro_entity_1.Libro, libro => libro.autor),
    __metadata("design:type", Object)
], Autor.prototype, "libros", void 0);
exports.Autor = Autor = __decorate([
    (0, core_1.Entity)()
], Autor);

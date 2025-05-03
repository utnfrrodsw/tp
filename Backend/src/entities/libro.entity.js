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
exports.Libro = void 0;
// src/entities/libro.entity.ts
const core_1 = require("@mikro-orm/core");
const categoria_entity_1 = require("./categoria.entity");
const editorial_entity_1 = require("./editorial.entity");
const autor_entity_1 = require("./autor.entity");
let Libro = class Libro {
};
exports.Libro = Libro;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Libro.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Libro.prototype, "nombre", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Libro.prototype, "sinopsis", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => autor_entity_1.Autor),
    __metadata("design:type", autor_entity_1.Autor)
], Libro.prototype, "autor", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => categoria_entity_1.Categoria),
    __metadata("design:type", categoria_entity_1.Categoria)
], Libro.prototype, "categoria", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => editorial_entity_1.Editorial),
    __metadata("design:type", editorial_entity_1.Editorial)
], Libro.prototype, "editorial", void 0);
exports.Libro = Libro = __decorate([
    (0, core_1.Entity)()
], Libro);

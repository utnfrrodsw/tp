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
exports.Categoria = void 0;
const core_1 = require("@mikro-orm/core");
const libro_entity_1 = require("./libro.entity");
const core_2 = require("@mikro-orm/core"); // Importar Collection
let Categoria = class Categoria {
    constructor() {
        this.libros = new core_2.Collection(this); // Usar Collection
    }
};
exports.Categoria = Categoria;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Categoria.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Categoria.prototype, "nombre", void 0);
__decorate([
    (0, core_1.OneToMany)(() => libro_entity_1.Libro, libro => libro.categoria),
    __metadata("design:type", Object)
], Categoria.prototype, "libros", void 0);
exports.Categoria = Categoria = __decorate([
    (0, core_1.Entity)()
], Categoria);

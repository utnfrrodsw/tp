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
exports.Resena = void 0;
const core_1 = require("@mikro-orm/core");
const usuario_entity_1 = require("./usuario.entity");
const libro_entity_1 = require("./libro.entity");
let Resena = class Resena {
};
exports.Resena = Resena;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Resena.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Resena.prototype, "comentario", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Resena.prototype, "estrellas", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Resena.prototype, "fechaResena", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], Resena.prototype, "usuario", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => libro_entity_1.Libro),
    __metadata("design:type", libro_entity_1.Libro)
], Resena.prototype, "libro", void 0);
exports.Resena = Resena = __decorate([
    (0, core_1.Entity)()
], Resena);

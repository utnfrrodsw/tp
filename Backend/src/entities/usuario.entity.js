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
exports.Usuario = void 0;
const core_1 = require("@mikro-orm/core");
let Usuario = class Usuario {
    // Método para validar la contraseña
    async validatePassword(password) {
        // Lógica de validación de la contraseña (puedes usar bcrypt)
        return this.password === password; // Simplificado para ejemplo
    }
    // Método para encriptar la contraseña
    async hashPassword() {
        // Aquí va la lógica para hash de contraseñas (puedes usar bcrypt o cualquier librería)
    }
};
exports.Usuario = Usuario;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Usuario.prototype, "username", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "refreshToken", void 0);
exports.Usuario = Usuario = __decorate([
    (0, core_1.Entity)()
], Usuario);

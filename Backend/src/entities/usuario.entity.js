var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
let Usuario = class Usuario {
    // Método para encriptar la contraseña
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    // Método para verificar la contraseña
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Usuario.prototype, "username", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
Usuario = __decorate([
    Entity()
], Usuario);
export { Usuario };

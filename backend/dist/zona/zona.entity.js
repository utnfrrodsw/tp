var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToMany, PrimaryKey, BaseEntity } from '@mikro-orm/core';
import { Usuario } from "../usuario/usuario.entity.js";
export let Zona = class Zona extends BaseEntity {
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Zona.prototype, "codZona", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Zona.prototype, "descripcionZona", void 0);
__decorate([
    ManyToMany(() => Usuario, usuario => usuario.zonas, { mappedBy: 'zonas' }),
    __metadata("design:type", Array)
], Zona.prototype, "usuarios", void 0);
Zona = __decorate([
    Entity()
], Zona);
//# sourceMappingURL=zona.entity.js.map
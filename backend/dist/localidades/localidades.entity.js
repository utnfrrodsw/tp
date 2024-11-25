var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Sucursal } from "../sucursal/sucursal.entity.js";
export let Localidad = class Localidad {
    constructor() {
        this.sucursales = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Localidad.prototype, "nombre_localidad", void 0);
__decorate([
    PrimaryKey({ unique: true }),
    __metadata("design:type", Number)
], Localidad.prototype, "id", void 0);
__decorate([
    OneToMany(() => Sucursal, sucursal => sucursal.localidad, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Localidad.prototype, "sucursales", void 0);
Localidad = __decorate([
    Entity()
], Localidad);
//# sourceMappingURL=localidades.entity.js.map
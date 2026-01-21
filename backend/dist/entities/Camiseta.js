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
exports.Camiseta = exports.EstadoCamiseta = exports.CondicionCamiseta = exports.Talle = void 0;
const core_1 = require("@mikro-orm/core");
const Usuario_1 = require("./Usuario");
const Categoria_1 = require("./Categoria");
const CompraItem_1 = require("./CompraItem");
var Talle;
(function (Talle) {
    Talle["XS"] = "XS";
    Talle["S"] = "S";
    Talle["M"] = "M";
    Talle["L"] = "L";
    Talle["XL"] = "XL";
    Talle["XXL"] = "XXL";
})(Talle || (exports.Talle = Talle = {}));
var CondicionCamiseta;
(function (CondicionCamiseta) {
    CondicionCamiseta["NUEVA"] = "Nueva";
    CondicionCamiseta["USADA"] = "Usada";
    CondicionCamiseta["VINTAGE"] = "Vintage";
})(CondicionCamiseta || (exports.CondicionCamiseta = CondicionCamiseta = {}));
var EstadoCamiseta;
(function (EstadoCamiseta) {
    EstadoCamiseta["DISPONIBLE"] = "disponible";
    EstadoCamiseta["VENDIDA"] = "vendida";
    EstadoCamiseta["EN_SUBASTA"] = "en_subasta";
    EstadoCamiseta["INACTIVA"] = "inactiva";
})(EstadoCamiseta || (exports.EstadoCamiseta = EstadoCamiseta = {}));
let Camiseta = class Camiseta {
    constructor(titulo, descripcion, equipo, temporada, talle, condicion, imagen, precioInicial, vendedor) {
        this.esSubasta = false;
        this.stock = 1;
        this.estado = EstadoCamiseta.DISPONIBLE;
        this.fechaCreacion = new Date(); // ✅ AGREGAR: Para ordenamiento en AdminController
        this.fechaPublicacion = new Date();
        this.subastas = new core_1.Collection(this);
        this.compraItems = new core_1.Collection(this);
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.equipo = equipo;
        this.temporada = temporada;
        this.talle = talle;
        this.condicion = condicion;
        this.imagen = imagen;
        this.precioInicial = precioInicial;
        this.vendedor = vendedor;
    }
};
exports.Camiseta = Camiseta;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Camiseta.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Camiseta.prototype, "titulo", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Camiseta.prototype, "descripcion", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Camiseta.prototype, "equipo", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Camiseta.prototype, "temporada", void 0);
__decorate([
    (0, core_1.Enum)(() => Talle),
    __metadata("design:type", String)
], Camiseta.prototype, "talle", void 0);
__decorate([
    (0, core_1.Enum)(() => CondicionCamiseta),
    __metadata("design:type", String)
], Camiseta.prototype, "condicion", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Camiseta.prototype, "imagen", void 0);
__decorate([
    (0, core_1.Property)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Camiseta.prototype, "precioInicial", void 0);
__decorate([
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], Camiseta.prototype, "esSubasta", void 0);
__decorate([
    (0, core_1.Property)({ default: 1 }),
    __metadata("design:type", Number)
], Camiseta.prototype, "stock", void 0);
__decorate([
    (0, core_1.Enum)(() => EstadoCamiseta),
    __metadata("design:type", String)
], Camiseta.prototype, "estado", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Camiseta.prototype, "fechaCreacion", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Camiseta.prototype, "fechaPublicacion", void 0);
__decorate([
    (0, core_1.ManyToOne)('Usuario'),
    __metadata("design:type", Usuario_1.Usuario)
], Camiseta.prototype, "vendedor", void 0);
__decorate([
    (0, core_1.ManyToOne)('Categoria', { nullable: true }),
    __metadata("design:type", Categoria_1.Categoria)
], Camiseta.prototype, "categoria", void 0);
__decorate([
    (0, core_1.OneToMany)('Subasta', 'camiseta'),
    __metadata("design:type", Object)
], Camiseta.prototype, "subastas", void 0);
__decorate([
    (0, core_1.OneToMany)(() => CompraItem_1.CompraItem, item => item.camiseta),
    __metadata("design:type", Object)
], Camiseta.prototype, "compraItems", void 0);
exports.Camiseta = Camiseta = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Number, Usuario_1.Usuario])
], Camiseta);

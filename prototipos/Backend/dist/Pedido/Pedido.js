export class Pedido {
    constructor(fecha, usuario, libro, estado = "Pendiente", _id) {
        this.fecha = fecha;
        this.usuario = usuario;
        this.libro = libro;
        this.estado = estado;
        this._id = _id;
    }
}
//# sourceMappingURL=Pedido.js.map
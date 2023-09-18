class Libro {

    constructor(data) {
        this.id = data.id;
        this.isbn = data.isbn;
        this.titulo = data.titulo;
        this.id_editorial = data.id_editorial;
        this.idioma = data.idioma;
        this.descripcion = data.descripcion;
        this.precio = data.precio;
        this.fecha = data.fecha;
    }

}

module.exports = Libro;

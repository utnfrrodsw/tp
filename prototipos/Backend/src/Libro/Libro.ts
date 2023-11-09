import { Double, ObjectId } from 'mongodb';

export class Libro {
    constructor(
        public isbn: string,
        public titulo: string,
        public idioma: string,
        public descripcion: string,
        public precio: Double,
        public fecha_edicion: Date,
        public autores: ObjectId[],
        public editorial: ObjectId,
        public categorias: ObjectId[],
        public formatos: ObjectId[],
        public _id?: ObjectId,
    ) { }
}

// TODO: Agregar portada de libro y calificación 
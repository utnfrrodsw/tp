import { Repository } from "../Shared/repository.js";
import { Libro } from "./Libro.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const libros = db.collection<Libro>('libros')

export class LibroRepository implements Repository<Libro>{

    public async findAll(): Promise<Libro[] | undefined> {
        try {
            return await libros.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Libro | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await libros.findOne({ _id })) || undefined
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Libro): Promise<Libro | undefined> {
        try {
            item._id = (await libros.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Libro): Promise<Libro | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await libros.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Libro | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await libros.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async findByEditorial(editorialId: string): Promise<Libro[] | undefined> {
        try {
            const librosEncontrados = await libros.find({ editorial: new ObjectId(editorialId) }).toArray();
            return librosEncontrados;
        } catch (error) {
            console.error("Error en findByEditorial:", error);
            throw error;
        }
    }

    public async findByAutor(autorId: string): Promise<Libro[] | undefined> {
        try {
            const librosEncontrados = await libros.find({ autores: new ObjectId(autorId) }).toArray();
            return librosEncontrados;
        } catch (error) {
            console.error("Error en findByAutor:", error);
            throw error;
        }
    }

    public async findByCategoria(categoriaId: string): Promise<Libro[] | undefined> {
        try {
            const librosEncontrados = await libros.find({ categorias: { $in: [new ObjectId(categoriaId)] } }).toArray();
            return librosEncontrados;
        } catch (error) {
            console.error("Error en findByCategoria:", error);
            throw error;
        }
    }

    public async findByFormatoLibro(formatoId: string): Promise<Libro[] | undefined> {
        try {
            const librosEncontrados = await libros.find({ formatos: { $in: [new ObjectId(formatoId)] } }).toArray();
            return librosEncontrados;
        } catch (error) {
            console.error("Error en findByFormatoLibro:", error);
            throw error;
        }
    }
}
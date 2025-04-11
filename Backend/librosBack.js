import express from 'express'; // Importamos Express para manejar las rutas y solicitudes HTTP
import { Sequelize } from 'sequelize'; // Importamos Sequelize para manejar la base de datos MySQL
import cors from 'cors'; // Importamos CORS para permitir solicitudes desde otros dominios

const app = express();
app.use(express.json()); // Permite recibir datos en formato JSON en las solicitudes
app.use(cors()); // Habilita CORS para permitir peticiones desde otros dominios

// Configuración de MySQL con Sequelize
const sequelize = new Sequelize('book_reviews', 'root', 'password', { // Conexión a la base de datos MySQL
    host: 'localhost',
    dialect: 'mysql'
});

// Definición de Modelos con Sequelize
import { DataTypes, Model } from 'sequelize';

// Modelo de Usuario
class User extends Model {}
User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // ID autoincremental
    nombre: DataTypes.STRING, // Nombre del usuario
    apellido: DataTypes.STRING, // Apellido del usuario
    email: DataTypes.STRING, // Correo electrónico del usuario
    telefono: DataTypes.STRING, // Teléfono del usuario
    tipo: DataTypes.STRING // Tipo de usuario (ej: lector, administrador)
}, { sequelize, modelName: 'user' });

// Modelo de Autor
class Author extends Model {}
Author.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // ID autoincremental
    nombre: DataTypes.STRING, // Nombre del autor
    apellido: DataTypes.STRING // Apellido del autor
}, { sequelize, modelName: 'author' });

// Modelo de Categoría
class Category extends Model {}
Category.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // ID autoincremental
    nombre: DataTypes.STRING // Nombre de la categoría (ej: ciencia ficción, drama, terror)
}, { sequelize, modelName: 'category' });

// Modelo de Libro
class Book extends Model {}
Book.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // ID autoincremental
    nombre: DataTypes.STRING, // Nombre del libro
    sinopsis: DataTypes.TEXT, // Resumen del libro
    categoriaId: { type: DataTypes.INTEGER, references: { model: Category, key: 'id' } }, // Relación con la categoría
    autorId: { type: DataTypes.INTEGER, references: { model: Author, key: 'id' } } // Relación con el autor
}, { sequelize, modelName: 'book' });

// Modelo de Reseña
class Review extends Model {}
Review.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // ID autoincremental
    usuarioId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } }, // Relación con el usuario
    libroId: { type: DataTypes.INTEGER, references: { model: Book, key: 'id' } }, // Relación con el libro
    comentario: DataTypes.TEXT, // Comentario de la reseña
    estrellas: DataTypes.INTEGER, // Calificación en estrellas (1-5)
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW } // Fecha de la reseña
}, { sequelize, modelName: 'review' });

// Rutas CRUD
// Ruta para crear un usuario
app.post('/usuarios', async (req, res) => {
    const user = await User.create(req.body); // Crea un nuevo usuario con los datos recibidos
    res.json(user); // Devuelve el usuario creado en la respuesta
});

// Ruta para obtener todos los libros con su categoría y autor asociados
app.get('/libros', async (req, res) => {
    const books = await Book.findAll({ include: [Category, Author] }); // Obtiene todos los libros con información de categoría y autor
    res.json(books); // Devuelve la lista de libros
});

// Ruta para agregar un nuevo libro
app.post('/libros', async (req, res) => {
    const book = await Book.create(req.body); // Crea un nuevo libro con los datos recibidos
    res.json(book); // Devuelve el libro creado en la respuesta
});

// Ruta para agregar una reseña de un libro
app.post('/reseñas', async (req, res) => {
    const review = await Review.create(req.body); // Crea una nueva reseña con los datos recibidos
    res.json(review); // Devuelve la reseña creada en la respuesta
});

// Ruta para obtener todas las reseñas de un libro específico
app.get('/reseñas/:libroId', async (req, res) => {
    const reviews = await Review.findAll({ where: { libroId: req.params.libroId }, include: [User] }); // Obtiene todas las reseñas de un libro con la información del usuario que la escribió
    res.json(reviews); // Devuelve la lista de reseñas
});

// Configuración del servidor
const PORT = 5000;
app.listen(PORT, async () => {
    await sequelize.sync(); // Sincroniza los modelos con la base de datos (crea las tablas si no existen)
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de confirmación en consola
});

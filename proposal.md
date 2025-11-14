# Propuesta TP DSW

## Grupo

### Integrantes
- 48318 - Merino, Federico

### Repositorios
- [Frontend App](https://github.com/fedemerino/dsw-frontend)  
- [Backend App](https://github.com/fedemerino/dsw-backend)  

---

## Tema

### Descripción

Aplicación web que permite a usuarios publicar alojamientos para alquiler temporario y a otros usuarios realizar reservas. Se podrán buscar alojamientos según fecha, localidad y cantidad de huéspedes, ver detalles de cada publicación, dejar reseñas, y gestionar reservas.

### Modelo

![DER](./modelo.png)

## Alcance Funcional

### Alcance Mínimo (Regularidad)

| Req              | Detalle |
|------------------|---------|
| CRUD simple      | 1. CRUD Usuarios<br>2. CRUD Provincias<br>3. CRUD Localidades <br>4. CRUD Métodos de Pago |
| CRUD dependiente | 1. CRUD Publicaciones (depende de Usuario, Localidad)<br>2. CRUD Imágenes (depende de Publicación)<br>3. CRUD Reservas (depende de Usuario y Publicación)<br>4. CRUD Reseñas (depende de Usuario y Publicación) |
| Listado + detalle| 1. Listado de publicaciones filtrado por localidad, fechas y cantidad de huéspedes<br>2. Detalle de cada publicación seleccionada |
| CUU / Epic       | 1. Registrar un usuario<br>2. Iniciar sesión<br>3. Realizar una publicación<br>4. Modificar o eliminar una publicación<br>5. Realizar una reserva |

---

### Alcance para Aprobación Directa

| Req     | Detalle |
|---------|---------|
| CRUDs   | CRUD completo de todas las entidades necesarias (Usuarios, Publicaciones, Reservas, Reseñas, Favoritos, Imágenes, Provincias, Localidades) |
| CUUs    | 1. Cancelar una reserva<br>2. Reseñar una publicación<br>3. Gestionar publicaciones propias<br>4. Agregar una publicación a favoritos<br>5. Bloquear un usuario<br>|

---

### Alcance Adicional Voluntario

| Req     | Detalle |
|---------|---------|
| CUUs    | 1. Envío de recordatorio de reserva por email<br>2. Recuperar contraseña |
| Otros   | 1. Dashboard para anfitriones<br>2. Vista de reservas realizadas y próximas

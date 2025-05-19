# Propuesta TP DSW

## Grupo

### Integrantes
- 41980 - Valenti, Sofía  
- 48318 - Merino, Federico  

### Repositorios
- [Frontend App](https://github.com/fedemerino/dsw-frontend)  
- [Backend App](https://github.com/fedemerino/dsw-backend)  

---

## Tema

### Descripción

Aplicación web que permite a usuarios publicar alojamientos para alquiler temporario y a otros usuarios realizar reservas. Se podrán buscar alojamientos según fecha, localidad y cantidad de huéspedes, ver detalles de cada publicación, dejar reseñas, y gestionar reservas.

### Modelo

![DER](LINK_A_TU_IMAGEN_DER)

## Alcance Funcional

### Alcance Mínimo (Regularidad)

| Req              | Detalle |
|------------------|---------|
| CRUD simple      | 1. CRUD Usuarios<br>2. CRUD Provincias<br>3. CRUD Localidades <br>4. CRUD Métodos de Pago |
| CRUD dependiente | 1. CRUD Propiedades (depende de Usuario, Localidad)<br>2. CRUD Imágenes (depende de Propiedad)<br>3. CRUD Reservas (depende de Usuario y Propiedad)<br>4. CRUD Reseñas (depende de Usuario y Propiedad) |
| Listado + detalle| 1. Listado de propiedades filtrado por localidad, fechas y cantidad de huéspedes<br>2. Detalle de cada propiedad seleccionada |
| CUU / Epic       | 1. Publicar una propiedad<br>2. Reservar un alojamiento<br>3. Cancelar una reserva<br>4. Modificar o eliminar una publicación<br>5. Dejar una reseña |

---

### Alcance para Aprobación Directa

| Req     | Detalle |
|---------|---------|
| CRUDs   | CRUD completo de todas las entidades necesarias (Usuarios, Propiedades, Reservas, Reseñas, Imágenes, Provincias, Localidades) |
| CUUs    | 1. Publicación de propiedad<br>2. Reserva y cancelación<br>3. Dejar reseña<br>4. Gestión de propiedades propias<br>5. Autenticación y niveles de acceso<br>6. Registro y login de usuario |

---

### Alcance Adicional Voluntario

| Req     | Detalle |
|---------|---------|
| CUUs    | 1. Envío de recordatorio de reserva por email<br>2. Marcado de favoritos<br>3. Reporte de publicaciones inadecuadas por usuarios |
| Otros   | 1. Sistema de reputación con promedio de calificaciones<br>2. Vista de reservas realizadas y próximas<br>3. Dashboard para anfitriones |


# Propuesta TP DSW

## Grupo
### Integrantes
* 50556 Gutierrez, Ramiro (304)
* 51857 Nicolás, Pedro (305)

## Tema
### Descripción
Alquiler de canchas de fútbol, el usuario ingresa el tipo de cancha, selecciona la fecha y un horario entre los disponibles y reserva un turno

## Modelo de dominio
![MD alquilercancha drawio](https://github.com/Gutilolo/TP---Gutierrez-Ramiro---Nicolas-Pedro/assets/133457577/c0c73c39-0f2b-49c8-9335-2f6fbf525ca1)


## Alcance Funcional

CRUD simple:          1. CRUD Usuario
                      2. CRUD Libro
                      3. CRUD Categoria
                      4. CRUD Favorito

CRUD dependiente:     1. CRUD Libro depende de CRUD Categoria. CRUD Favorito depende CRUD Libro y CRUD Usuario

Listado + detalle:   	1. Listado de libros publicados filtrado por codigo, categoria, autor y precio 
                      2. Listado de favoritos por usuario filtrado por fecha de agregado
                      3. Listado de categoria filtrado por nombre
                    
CUU:                  1. Registrar Usuario
                      2. Seleccionar Libro
                      3. Agregar favorito
                      





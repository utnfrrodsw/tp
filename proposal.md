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

CRUD simple:          1. CRUD Cliente
                      2. CRUD Alquiler
                      3. CRUD Cancha
                      4. CRUD TipoCancha
                      5. CRUD HorariosDisponibles

CRUD dependiente:     1. CRUD Cancha {depende de} CRUD TipoCancha. 
                      2. CRUD Cancha {depende de} CRUD horariosDisponibles.

Listado + detalle:   	1. Listado de canchas disponibles filtrado por dia y hora 
                      
                    
CUU:                  1. Registrar cliente
                      





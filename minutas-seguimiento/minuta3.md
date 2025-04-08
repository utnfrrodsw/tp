# Minuta Nº 3


##  Información del Proyecto

**Nombre del Proyecto:** Trabajo Práctico Desarrollo de Software  
**Fecha:** 07/06/2024    
**Participantes:**  
- Zapata Nicolás
- Leali Bruno
- Boggio Valentino
- Larrauri Martina

##  Cronograma de Trabajo

| Fase                  | Descripción                            | Fecha de Inicio | Fecha de Fin   |
|-----------------------|----------------------------------------|-----------------|----------------|
| Finalización parcial del Modelo          | Creamos una nueva clase **Payments**, eliminamos la clase **material_Costs** y definimos: atributos, PK y FK de las clases ya existentes.    | 04/06/2024  | 06/06/2024    |
| Reestructuración de la API                |  Implementamos MVC architecture para el desarrollo de los CRUD.       | 04/06/2024  | 04/06/2024    |
| División y ejecución de tareas            | Asignamos la creación y prueba de un CRUD en memoria a cada integrante.   | 04/06/2024  | 07/06/2024 
   

## Avances
- Definimos casi en su totalidad el modelo de dominio de la propuesta que presentamos. Sobre todo los atributos de clases. 
    - No es 100% final ya que a medida que desarrollemos pueden surgir modificaciones.

- Nuestra API quedó completa en cuanto a tener todos los CRUD de las clases pero por ahora solo en memoria.
###  Backend
- Implementación de MVC Architecture para una organización en capas.
- Creación de:
	-  **./shared** → para guardar archivos compartidos entre clases.
        - **repository.ts** → interface Repository que contiene los métodos compartidos pa los CRUDs. 
	- **./customer**
        - **customer.controler.ts**
        - **customer.entity.ts**
        - **customer.repository.ts**
        - **customer.routes.ts**
        - **customers.http**
	- **./employee**
        - **employee.controler.ts**
        - **employee.entity.ts**
        - **employee.repository.ts**
        - **employee.routes.ts**
        - **employees.http**
    - **./order**
        - **order.controler.ts**
        - **order.entity.ts**
        - **order.repository.ts**
        - **order.routes.ts**
        - **orders.http**
    - **./material**
        - **material.controler.ts**
        - **material.entity.ts**
        - **material.repository.ts**
        - **material.routes.ts**
        - **materials.http**
    - **./payment**
        - **payment.controler.ts**
        - **payment.entity.ts**
        - **payment.repository.ts**
        - **payment.routes.ts**
        - **payments.http**

###  Frontend
- *Proximamente*

##  Próximos Pasos
- Investigación de la documentación de las Bases de Datos 
- Modificación de los CRUD para que persistan

##  Comentarios Adicionales
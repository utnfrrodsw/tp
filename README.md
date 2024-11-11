# Propuesta TP DSW

# Sistema de streaming de podcast y audiolibros *"Prometeo"*

## **Integrantes:**  

- 46166 - Borelli, Hernán Darío
- 51322 - Cilfone, Angel David Carlos
- 39715 - Coyle, Virginia Mariel
- 49500 - Faulin, Eugenio Pandu

## **Repositorio:**
- [BackEnd](https://github.com/efaulin/tp-prometeo-back.git)
- [FrontEnd](https://github.com/efaulin/tp-prometeo-front.git)

Servicio de streaming de podcast y audiolibros online por suscripción, los usuarios podrán contratar el servicio, registrarse, consumir contenido y además poder dejar una reseña del mismo. El contenido se clasifica entre podcasts o audiolibros. Habrá diferentes categorías de suscripción (ej. gratuita, premium, estudiante, etc.). 

## **Modelo:**
![Diagrama Entidad-Relacion](https://github.com/hdborelli/TP_DSW_CBFN/blob/main/Assets/Modelo%20de%20base%20de%20datos.drawio.png)

- [Modelo](https://drive.google.com/file/d/11ACZJqwl76ydJ1UTIr_Lcnx58QASBCiV/view?usp=drive_link)

## Alcance funcional
### Regularidad
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Suscripcion<br>3. CRUD Capitulo|
|CRUD dependiente|1. CRUD Usuario_Suscripcion {depende de} CRUD Usuario CRUD Suscripcion <br>2. CRUD Reproduccion {depende de} CRUD Usuario CRUD Capitulo|
|Listado<br>+<br>detalle| 1. Listado de historial de Suscripciones => detalle CRUD Suscripcion<br> 2. Listado de Colecciones por categorias => detalle CRUD Coleccion|
|CUU/Epic|1. Escuchar un "Audiolibro/Podcast"<br>2. Subir un "Audiolibro/Podcast"<br>|
### Promocion
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Suscripcion<br>3. CRUD Capitulo<br>4. CRUD Coleccion<br>5. CRUD Categoria|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Suscripcion<br>2. CRUD Usuario_Suscripcion {depende de} CRUD Usuario CRUD Suscripcion <br>3. CRUD Reproduccion {depende de} CRUD Usuario CRUD Capitulo|
|Listado<br>+<br>detalle| 1. Listado de historial de Suscripciones => detalle CRUD Suscripcion<br> 2. Listado de Colecciones por categorias => detalle CRUD Coleccion|
|CUU/Epic|1. Escuchar un "Audiolibro/Podcast"<br>2. Subir un "Audiolibro/Podcast"<br>3. Dejar comentario/reseña en un "Audiolibro/Podcast"|

#### Comparación de Librerías para: **Comunicación con Backend**

**Problema:** Necesitamos una forma consistente, segura y sencilla de realizar peticiones HTTP a nuestro backend, incluyendo la autenticación mediante tokens JWT.

| Criterio                    | ![alt text](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | ![alt text](https://img.shields.io/badge/Fetch_API-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Popularidad / Comunidad** | Muy alta. Estandar de facto en la industria.                                                          | Alta, nativo de los navegadores.                                                                               |
| **Curva de Aprendizaje**    | Baja. API intuitiva basada en promesas.                                                               | Baja. API simple basada en promesas.                                                                           |
| **Interceptores**           | Soportados. Ideal para inyectar tokens JWT (y para manejo de errores, logging, etc.).                 | No soportados nativamente. Requiere código adicional o bibliotecas externas para implementar.                  |
| **Manejo de Errores**       | Intuitivo. Permite manejar errores de red y de la API con facilidad.                                  | Requiere verificar response.ok y procesar diferentes códigos de estado.                                        |
| **Tamaño del Bundle**       | Ligero, pero añade una dependencia externa.                                                           | Nativo, no impacta el tamaño del bundle (si se usa en un entorno con soporte nativo).                          |
| **Flexibilidad**            | Amplia, con configuración y plugins para diferentes casos de uso.                                     | Buena, pero con menos flexibilidad y funcionalidades "out of the box".                                         |
| **Veredicto Rápido**        | El cliente HTTP por excelencia.                                                                       | Funcional, pero requiere un poco más de esfuerzo para tareas comunes.                                          |

---

**🏆 Decisión Final:** Se elige **Axios**.

**Justificación Principal:** La capacidad de usar interceptores facilita enormemente la gestión de la autenticación con JWT, simplificando la lógica en múltiples componentes y manteniéndola centralizada. Esto permite un código más limpio, seguro y mantenible. Aunque Fetch es una alternativa nativa, la conveniencia y las funcionalidades adicionales que ofrece Axios justifican la inclusión de la dependencia.
# 📘Documentacion del backend
El backend del sistema de supermercado es una API REST desarrollada para gestionar de manera centralizada y segura las operaciones principales del sistema. Esta API constituye el núcleo funcional de la aplicación, ya que se encarga de implementar la lógica de negocio, el acceso a la base de datos y los mecanismos de seguridad necesarios para garantizar el correcto funcionamiento de la plataforma.

## Tecnologías utilizadas
<table>
  <tr>
    <td align="center" width="200" height="160">
      <img src="https://www.startechup.com/wp-content/uploads/January-11-2021-Nodejs-What-it-is-used-for-and-when-where-to-use-it-for-your-enterprise-app-development.jpg" height="80"><br><br>
      <strong>Node.js</strong>
    </td>
    <td align="center" width="200" height="160">
      <img src="https://redberries.ae/wp-content/uploads/2023/06/express-js.png" height="80"><br><br>
      <strong>Express.js</strong>
    </td>
    <td align="center" width="200" height="160">
      <img src="https://raw.githubusercontent.com/mikro-orm/mikro-orm/master/docs/static/img/logo-readme.svg?sanitize=true" height="80"><br><br>
      <strong>MikroORM</strong>
    </td>
    <td align="center" width="200" height="160">
      <img src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" height="80"><br><br>
      <strong>MySQL</strong>
    </td>
  </tr>
</table>

---

## Librerias y dependencias
### Autenticación y seguridad
<table>
  <tr>
    <td align="center" width="200" height="160">
      <img src="https://jwt.io/img/pic_logo.svg" height="70"><br><br>
      <strong>jsonwebtoken</strong><br>
      Generación y validación de JWT
    </td>
    <td align="center" width="200" height="160">
      <img src="https://avatars.githubusercontent.com/u/10354193?s=200&v=4" height="70"><br><br>
      <strong>bcrypt</strong><br>
      Encriptación de contraseñas
    </td>
    <td align="center" width="200" height="160">
      <img src="https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.svg" height="70"><br><br>
      <strong>dotenv</strong><br>
      Manejo de variables de entorno
    </td>
    <td align="center" width="200" height="160">
      <img src="https://miro.medium.com/v2/resize:fit:1400/1*Sj3VNGxYNqQMO3aSoJoGsw.png" height="70"><br><br>
      <strong>cors</strong><br>
      Control de acceso entre dominios
    </td>
  </tr>
</table>

### Utilidades
<table>
  <tr>
    <td align="center" width="250" height="160">
      <img src="https://express-validator.github.io/img/logo.svg" height="70"><br><br>
      <strong>express-validator</strong><br>
      Validación de datos
    </td>
    <td align="center" width="250" height="160">
      <img src="https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png" height="70"><br><br>
      <strong>nodemon (dev)</strong><br>
      Recarga automática
    </td>
  </tr>
</table>

---

## Información adicional sobre la API

| Documento | Descripción |
| :--- | :--- |
| **[Endpoints](../api/endPoints.md)** | Lista completa de endpoints organizados por módulos |
| **[Formato de Respuesta](../api/formatoRespuesta.md)** | Estructura de respuestas JSON para operaciones exitosas y errores |
| **[Seguridad](../api/seguridad.md)** | Autenticación JWT, protección de rutas y validación |

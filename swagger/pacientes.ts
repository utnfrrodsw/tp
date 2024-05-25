/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Obtiene información sobre los pacientes
 *     description: Este endpoint devuelve una lista de información sobre los pacientes.
 *     tags:
 *       - Pacientes
 *     responses:
 *       200:
 *         description: Pacientes encontrados
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obtiene información sobre un paciente específico
 *     description: Este endpoint devuelve información sobre un paciente específico basado en el ID proporcionado.
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del paciente
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Paciente encontrado.
 *       404:
 *         description: Paciente no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Crea un nuevo paciente
 *     description: Este endpoint crea un nuevo paciente basado en los datos proporcionados.
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - in: body
 *         name: paciente
 *         description: Datos del nuevo paciente
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             idRol:
 *               type: string
 *             telefono:
 *               type: string
 *             direccion:
 *               type: string
 *             idLocalidad:
 *               type: string
 *             tipoDni:
 *               type: string
 *             dni:
 *               type: string
 *     responses:
 *       201:
 *         description: Paciente creado correctamente.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Actualiza un paciente
 *     description: Este endpoint actualiza a un paciente basado en los datos proporcionados.
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del paciente
 *         required: true
 *         type: string
 *       - in: body
 *         name: paciente
 *         description: Datos a actualizar del paciente
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             idRol:
 *               type: string
 *             telefono:
 *               type: string
 *             direccion:
 *               type: string
 *             idLocalidad:
 *               type: string
 *             tipoDni:
 *               type: string
 *             dni:
 *               type: string
 *     responses:
 *       201:
 *         description: Paciente actualizado correctamente.
 *       404:
 *         description: Paciente no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/pacientes/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un paciente
 *     description: Este endpoint actualiza algunos campos de la entidad paciente basado en los datos proporcionados.
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del paciente
 *         required: true
 *         type: string
 *       - in: body
 *         name: paciente
 *         description: Datos a actualizar del paciente
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             tipoDni:
 *               type: string
 *             dni:
 *               type: string
 *     responses:
 *       201:
 *         description: Paciente actualizado correctamente.
 *       404:
 *         description: Paciente no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/pacientes/{id}:
 *   delete:
 *     summary: Borra un paciente específico
 *     description: Este endpoint borra información sobre un paciente específico basado en el ID proporcionado.
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del paciente
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Paciente borrado correctamente.
 *       404:
 *         description: Paciente no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

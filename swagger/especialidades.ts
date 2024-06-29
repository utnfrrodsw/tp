/**
 * @swagger
 * /api/especialidades:
 *   get:
 *     summary: Obtiene información sobre los especialidades
 *     description: Este endpoint devuelve una lista de información sobre los especialidades.
 *     tags:
 *       - especialidades
 *     responses:
 *       200:
 *         description: especialidades encontrados
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/especialidades/{id}:
 *   get:
 *     summary: Obtiene información sobre un especialidad específico
 *     description: Este endpoint devuelve información sobre un especialidad específico basado en el ID proporcionado.
 *     tags:
 *       - especialidades
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del especialidad
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: especialidad encontrado.
 *       404:
 *         description: especialidad no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/especialidades:
 *   post:
 *     summary: Crea un nuevo especialidad
 *     description: Este endpoint crea un nuevo especialidad basado en los datos proporcionados.
 *     tags:
 *       - especialidades
 *     parameters:
 *       - in: body
 *         name: especialidad
 *         description: Datos del nuevo especialidad
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             descEsp:
 *               type: string
 *     responses:
 *       201:
 *         description: especialidad creado correctamente.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/especialidades/{id}:
 *   put:
 *     summary: Actualiza un especialidad
 *     description: Este endpoint actualiza a un especialidad basado en los datos proporcionados.
 *     tags:
 *       - especialidades
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del especialidad
 *         required: true
 *         type: string
 *       - in: body
 *         name: especialidad
 *         description: Datos a actualizar del especialidad
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             descEsp:
 *               type: string 
 *     responses:
 *       201:
 *         description: especialidad actualizado correctamente.
 *       404:
 *         description: especialidad no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/especialidades/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un especialidad
 *     description: Este endpoint actualiza algunos campos de la entidad especialidad basado en los datos proporcionados.
 *     tags:
 *       - especialidades
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del especialidad
 *         required: true
 *         type: string
 *       - in: body
 *         name: especialidad
 *         description: Datos a actualizar del especialidad
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             descEsp:
 *               type: string
 *     responses:
 *       201:
 *         description: especialidad actualizado correctamente.
 *       404:
 *         description: especialidad no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/especialidades/{id}:
 *   delete:
 *     summary: Borra un especialidad específico
 *     description: Este endpoint borra información sobre un especialidad específico basado en el ID proporcionado.
 *     tags:
 *       - especialidades
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del especialidad
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: especialidad borrado correctamente.
 *       404:
 *         description: especialidad no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

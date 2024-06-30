/**
 * @swagger
 * /api/medicos:
 *   get:
 *     summary: Obtiene información sobre los medicos
 *     description: Este endpoint devuelve una lista de información sobre los medicos.
 *     tags:
 *       - Médicos
 *     responses:
 *       200:
 *         description: medicos encontrados
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/medicos/{id}:
 *   get:
 *     summary: Obtiene información sobre un medico específico
 *     description: Este endpoint devuelve información sobre un medico específico basado en el ID proporcionado.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del medico
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: medico encontrado.
 *       404:
 *         description: medico no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/medicos:
 *   post:
 *     summary: Crea un nuevo medico
 *     description: Este endpoint crea un nuevo medico basado en los datos proporcionados.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: body
 *         name: medico
 *         description: Datos del nuevo medico
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             telefono:
 *               type: string
 *             tipoDni:
 *               type: string
 *             idEspecialidad:
 *               type: string
 *             horaDesde:
 *               type: string
 *             horaHasta:
 *               type: string
 *             matricula:
 *               type: string 
 *             diasAtencion:
 *               type: string         
 *     responses:
 *       201:
 *         description: medico creado correctamente.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/medicos/{id}:
 *   put:
 *     summary: Actualiza un medico
 *     description: Este endpoint actualiza a un medico basado en los datos proporcionados.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del medico
 *         required: true
 *         type: string
 *       - in: body
 *         name: medico
 *         description: Datos a actualizar del medico
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             telefono:
 *               type: string
 *             idEspecialidad:
 *               type: string
 *             horaDesde:
 *               type: string
 *             horaHasta:
 *               type: string
 *             matricula:
 *               type: string 
 *             diasAtencion:
 *               type: string 
 *             email:
 *               type: string          
 *     responses:
 *       201:
 *         description: medico actualizado correctamente.
 *       404:
 *         description: medico no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/medicos/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un medico
 *     description: Este endpoint actualiza algunos campos de la entidad medico basado en los datos proporcionados.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del medico
 *         required: true
 *         type: string
 *       - in: body
 *         name: medico
 *         description: Datos a actualizar del medico
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             telefono:
 *               type: string
 *             idEspecialidad:
 *               type: string
 *             horaDesde:
 *               type: string
 *             horaHasta:
 *               type: string
 *             matricula:
 *               type: string 
 *             diasAtencion:
 *               type: string  
 *             email:
 *               type: string
 *     responses:
 *       201:
 *         description: medico actualizado correctamente.
 *       404:
 *         description: medico no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

/**
 * @swagger
 * /api/medicos/{id}:
 *   delete:
 *     summary: Borra un medico específico
 *     description: Este endpoint borra información sobre un medico específico basado en el ID proporcionado.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del medico
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: medico borrado correctamente.
 *       404:
 *         description: medico no encontrado.
 *       500:
 *         description: Ocurrio un error interno.
 */

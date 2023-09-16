// FUNCIONES CREADAS PARA SIMPLIFICAR EL CODIGO Y PODER IMPORTARLO EN DIFERENTES CONTROLADORES

// Función de manejo de errores
function handleError(res, errorMessage) {
	res.status(500).json({ success: false, msg: errorMessage });
}

// Función de utilidad 'response'
function response(success, data = null, msg = "") {
	return {
		success,
		data,
		msg,
	};
}

module.exports = { handleError, response };

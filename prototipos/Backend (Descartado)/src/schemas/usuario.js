class Usuario {
	constructor(data) {
		this.id = data.id;
		this.nombre = data.nombre;
		this.apellido = data.apellido;
		this.email = data.email;
		this.direccion = data.direccion;
		this.id_localidad = data.id_localidad;
		this.avatar = data.avatar;
		this.tipo = data.tipo;
	}
}

module.exports = Usuario;

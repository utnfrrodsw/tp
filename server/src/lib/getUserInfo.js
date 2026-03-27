exports.getUserInfo = function(user){
    return {
        id: user.idUsuario,
        email : user.email,
        nombre : user.nombre,
        apellido : user.apellido,
        esPrestador : user.esPrestador,
        fechaNacimiento : user.fechaNacimiento,
        telefono : user.telefono,
    }
}


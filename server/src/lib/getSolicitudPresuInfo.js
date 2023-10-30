exports.getSolicitudPresuInfo = function(solicitud, fotosSolicitud, presupuesto){
    const fechaHora = new Date(solicitud.fechaHora);
    const fecha = fechaHora.getDate() + '/' + (fechaHora.getMonth()+1) + '/' + fechaHora.getFullYear() + ' ' + fechaHora.getHours() + ':' + fechaHora.getMinutes() + 'hs';
    return {
        id: solicitud.idSolicitud,
        idPrestador: presupuesto.usuario.idUsuario,
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        fechaHora: fecha,
        profesion: solicitud.profesiones,
        direccion: solicitud.direccion,
        fotos: fotosSolicitud,
        nombrePrestador: presupuesto.usuario.nombre + ' ' + presupuesto.usuario.apellido,
        telefonoPrestador: presupuesto.usuario.telefono,
        costoTotal: presupuesto.costoMateriales + (presupuesto.tiempoAprox * presupuesto.costoXHora),
    }
}


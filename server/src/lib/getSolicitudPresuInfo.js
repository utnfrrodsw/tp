exports.getSolicitudPresuInfo = function(solicitud, fotosSolicitud, presupuesto, resenia, estadoServicio){
    const fechaHora = new Date(solicitud.fechaHora);
    const fecha = fechaHora.getDate() + '/' + (fechaHora.getMonth()+1) + '/' + fechaHora.getFullYear() + ' ' + fechaHora.getHours() + ':' + fechaHora.getMinutes() + 'hs';
    const reseniaCartel = resenia === 6 ? 'No Calificado' : 'La Calificacion de este servicio fue de ' + resenia + ' estrellas';
    return {
        id: solicitud.idSolicitud,
        idPrestador: presupuesto.usuario.idUsuario,
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        estadoServicio: estadoServicio,
        fechaHora: fecha,
        profesion: solicitud.profesiones,
        direccion: solicitud.direccion,
        fotos: fotosSolicitud,
        nombrePrestador: presupuesto.usuario.nombre + ' ' + presupuesto.usuario.apellido,
        telefonoPrestador: presupuesto.usuario.telefono,
        costoTotal: presupuesto.costoMateriales + (presupuesto.tiempoAprox * presupuesto.costoXHora),
        cartelResenia: reseniaCartel,
    }
}


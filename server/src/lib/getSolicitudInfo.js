exports.getSolicitudInfo = function(solicitud, fotosSolicitud){
    return {
        id: solicitud.idSolicitud,
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        fechaHora: solicitud.fechaHora,
        especialidad: solicitud.especialidad,
        direccion: solicitud.direccion,
        fotos: fotosSolicitud
    }
}


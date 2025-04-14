exports.getSolicitudInfo = function(solicitud, fotosSolicitud){

    const fechaHora = new Date(solicitud.fechaHora);
    const fecha = fechaHora.getDate() + '/' + (fechaHora.getMonth()+1) + '/' + fechaHora.getFullYear() + ' ' + fechaHora.getHours() + ':' + fechaHora.getMinutes() + 'hs';
    
    return {
        id: solicitud.idSolicitud,
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        fechaHora: fecha,
        profesion: solicitud.profesiones,
        direccion: solicitud.direccion,
        fotos: fotosSolicitud
    }
}


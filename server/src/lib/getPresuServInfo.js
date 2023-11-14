exports.getPresuServInfo = function(presupuesto,direccion){

    const solicitud=JSON.parse(JSON.stringify(direccion.solicitudes))[0];
    const servicio=JSON.parse(JSON.stringify(presupuesto.presupuesto))[0];
    const fechasDisponibles = [];
    presupuesto.horariosPresupuesto.map((horario) => {
        console.log(horario.horario);
        const date = new Date(horario.horario);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = date.toLocaleString('es-AR', options); // Ajusta 'es-ES' según la zona horaria deseada
        fechasDisponibles.push(formattedDate);
    });
    const dir=direccion.calle +" "+ direccion.numero +", "+ direccion.piso +" "+ 
    direccion.dpto +". "+direccion.localidad.nombre +", "+direccion.localidad.provincia;
    return {
        idSolicitud: presupuesto.idSolicitud,
        cliente: direccion.usuario.nombre+" "+direccion.usuario.apellido,
        titulo: solicitud.titulo,
        fechaPublicacion: solicitud.fechaHora,
        descripcion: solicitud.descripcion,
        direccion: dir,
        materiales: presupuesto.materiales,
        costoMateriales: presupuesto.costoMateriales,
        costoXHora: presupuesto.costoXHora,
        tiempoAprox: presupuesto.tiempoAprox,
        fechasDisponibles: fechasDisponibles,
        costoTotal: servicio? (presupuesto.costoXHora * presupuesto.tiempoAprox) + presupuesto.costoMateriales: undefined,
        estado: servicio? servicio.estado: undefined,
        fechaFinal: servicio? servicio.fechaHora: undefined,
        resenia: servicio? servicio.resenia: undefined
    }
}
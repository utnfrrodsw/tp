exports.getPresuServInfo = function(presupuesto,direccion){
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
        titulo: direccion.solicitudes.titulo,
        fechaPublicacion: direccion.solicitudes.fechaHora,
        descripcion: direccion.solicitudes.descripcion,
        direccion: dir,
        costoMateriales: presupuesto.costoMateriales,
        costoXHora: presupuesto.costoXHora,
        tiempoAprox: presupuesto.tiempoAprox,
        costoTotal: (presupuesto.costoXHora * presupuesto.tiempoAprox) + presupuesto.costoMateriales,
        estado: presupuesto.presupuesto.estado,
        fechasDisponibles: fechasDisponibles,
        fechaFinal: presupuesto.presupuesto.fechaHora,
        resenia:presupuesto.presupuesto.resenia
    }
}
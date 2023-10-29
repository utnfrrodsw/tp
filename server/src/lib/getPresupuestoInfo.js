exports.getPresupuestoInfo = function(presupuesto){
    const fechasDisponibles = [];
    presupuesto.horariosPresupuesto.map((horario) => {
        console.log(horario.horario);
        const date = new Date(horario.horario);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = date.toLocaleString('es-AR', options); // Ajusta 'es-ES' según la zona horaria deseada
        fechasDisponibles.push(formattedDate);
    });

    return {
        idPrestador: presupuesto.usuario.idUsuario,
        nombrePrestador: presupuesto.usuario.nombre + ' ' + presupuesto.usuario.apellido,
        idPresupuesto: presupuesto.idPresupuesto,
        idSolicitud: presupuesto.idSolicitud,
        costoMateriales: presupuesto.costoMateriales,
        costoXHora: presupuesto.costoXHora,
        tiempoAprox: presupuesto.tiempoAprox,
        costoTotal: (presupuesto.costoXHora * presupuesto.tiempoAprox) + presupuesto.costoMateriales,
        fechasDisponibles: fechasDisponibles,
    }
}
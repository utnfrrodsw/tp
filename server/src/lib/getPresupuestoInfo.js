exports.getPresupuestoInfo = function(presupuesto, horarios, promedio){
    const fechasDisponibles = [];
    horarios.map((horario) => {
        const date = new Date(horario.horario);
        console.log(date);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = date.toLocaleString('es-AR', options); // Ajusta 'es-ES' según la zona horaria deseada
        fechasDisponibles.push(formattedDate);
    });

    return {
        idPrestador: presupuesto.usuario.idUsuario,
        nombrePrestador: presupuesto.usuario.nombre + ' ' + presupuesto.usuario.apellido,
        rating: promedio || 0,
        id: presupuesto.idSolicitud,
        idSolicitud: presupuesto.idSolicitud,
        materiales: presupuesto.materiales,
        costoMateriales: presupuesto.costoMateriales,
        costoXHora: presupuesto.costoXHora,
        tiempoAprox: presupuesto.tiempoAprox,
        costoTotal: (presupuesto.costoXHora * presupuesto.tiempoAprox) + presupuesto.costoMateriales,
        fechasDisponibles: fechasDisponibles,
    }
}
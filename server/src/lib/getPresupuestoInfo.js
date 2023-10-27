exports.getPresupuestoInfo = function(presupuesto){
    return {
        nombrePrestador: presupuesto.usuario.nombre + ' ' + presupuesto.usuario.apellido,
        idPresupuesto: presupuesto.idPresupuesto,
        idSolicitud: presupuesto.idSolicitud,
        costoMateriales: presupuesto.costoMateriales,
        costoXHora: presupuesto.costoXHora,
        tiempoAprox: presupuesto.tiempoAprox,
        costoTotal: (presupuesto.costoXHora * presupuesto.tiempoAprox) + presupuesto.costoMateriales,
        fechasDisponibles: presupuesto.horariosPresupuesto,
    }
}
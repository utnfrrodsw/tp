exports.getPresupuestoInfo = function(presupuesto, horarios){
    const horariosterminado = horarios.map((horario) => {
        return horario.horario;
    });
    return {
        idPrestador: presupuesto.usuario.idUsuario,
        nombrePrestador: presupuesto.usuario.nombre + ' ' + presupuesto.usuario.apellido,
        id: presupuesto.idSolicitud,
        idSolicitud: presupuesto.idSolicitud,
        materiales: presupuesto.materiales,
        costoMateriales: presupuesto.costoMateriales,
        costoXHora: presupuesto.costoXHora,
        tiempoAprox: presupuesto.tiempoAprox,
        costoTotal: (presupuesto.costoXHora * presupuesto.tiempoAprox) + presupuesto.costoMateriales,
        fechasDisponibles: horariosterminado,
    }
}
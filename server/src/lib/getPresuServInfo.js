exports.getPresuServInfo = function(presupuesto){
    const fechasDisponibles = [];
    presupuesto.horariosPresupuesto.map((horario) => {
        console.log(horario.horario);
        const date = new Date(horario.horario);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = date.toLocaleString('es-AR', options); // Ajusta 'es-ES' según la zona horaria deseada
        fechasDisponibles.push(formattedDate);
    });
    const dir=presupuesto.direccion.calle +" "+ presupuesto.direccion.numero +", "+ presupuesto.direccion.piso +" "+ 
    presupuesto.direccion.depto +". "+presupuesto.localidad.nombre +", "+presupuesto.localidad.provincia;
    return {
        idSolicitud: presupuesto.idSolicitud,
        titulo: presupuesto.anuncio.titulo,
        fechaPublicacion: presupuesto.anuncio.fechaHora,
        descripcion: presupuesto.anuncio.descripcion,
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
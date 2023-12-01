import { fetchPatch, fetchGet } from "../services/fetchIntercept.js";


export const fetchPagarPresupuesto = async (idSolicitud, idPrestador, fecha, token ) => {

    const body = JSON.stringify({
        fecha: fecha
    });

    const response = await fetchPatch(`/presupuesto/pagar/${idSolicitud}/${idPrestador}`, body, token)
    .then(response => {
        return response;
    })

    return response
};

export const getPresupuestosSolicitud = async (id, token ) => {
    try{
        const response = await fetchGet(`/presupuesto/solicitud/${id}`, token)
        .then(response => {
            return response;
        })
        return response;
    }catch(error){
        throw new Error(error.message);
    }
}
import { fetchPatch, fetchGet,fetchPost } from "../services/fetchIntercept.js";

export const setPresupuesto = async (presupuestoData) => {
  try {
    const data = JSON.stringify(presupuestoData);
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await fetchPost(`/presupuesto/nuevoPresupuesto`, data, headers)
    .then(response => {
      return response;
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

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

export const getPresupuestoPrestador= async(idSolicitud,idPrestador)=>{
  try{
    const response = await fetchGet(`/presupuesto/solicitud/${idSolicitud}/prestador/${idPrestador}`)
    .then(response => {
      return response;
    })
    return response;
  }catch(error){
    throw new Error(error.message);
  }
}
import { fetchPatch, fetchGet,fetchPost } from "../services/fetchIntercept.js";

export const setPresupuesto= async (presupuestoData) => {
  try {
    const response = await fetchPost(`/presupuesto/nuevoPresupuesto`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presupuestoData),
    });

    const data = await response.json();

    if (data.error) {
      throw data.error;
    }

    return data;
  } catch (error) {
    throw new Error('Error al enviar el presupuesto: ' + error.message);
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
        const presupuestos = await fetchGet(`/presupuesto/solicitud/${id}`, token)
        .then(response => {
            return response;
        })
        return presupuestos;
    }catch(error){
        throw new Error(error.message);
    }
}

export const getPresupuestoPrestador= async(idSolicitud,idPrestador)=>{
  try{
    const presupuesto= await fetchGet(`/presupuesto/solicitud/${idSolicitud}/prestador/${idPrestador}`)
    .then(response=>{
      return response.body.presupuesto;
    })
    return presupuesto;
  }catch(error){
    throw new Error(error.message);
  }
}
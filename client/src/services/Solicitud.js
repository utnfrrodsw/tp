import { fetchGet, fetchPost, fetchDelete, fetchPatch } from "../services/fetchIntercept.js";

export const setSolicitud = async (id, data, token ) => {
    try{
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await fetchPost(`/solicitud/cliente/${id}`, data, token, headers)
        .then(response => {
            return response;
        })
        return response
    }   
    catch(error){
        throw new Error(error.message);
    }
};

export const getSolicitudes = async (estado, idUsuario, token ) => {
    try{
        const response = await fetchGet(`/solicitud/${estado}/cliente/${idUsuario}`, token)
        .then(response => {
            return response;
        })
        console.log(response.body.solicitudes)
        return response.body.solicitudes;
    }catch(error){
        throw new Error(error.message);
    }
};

export const deleteSolicitud = async (id, token ) => {
    try{
        const response = await fetchDelete(`/solicitud/cancelar/${id}`, token)
        .then(response => {
            return response;
        })
        console.log(response)
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};

export const fetchGetReseña = async (idSolicitud, idPrestador, token ) => {
    try{
        const response = await fetchGet(`/servicio/isreviewed/${idSolicitud}/${idPrestador}`, token)
        .then(response => {
            return response;
        })
        return response;
    }catch(error){
        throw new Error(error.message);
    }
}

export const fetchHacerReseña = async (idSolicitud, idPrestador, resenia, token ) => {   
    try{
        const body =  JSON.stringify({
            resenia: resenia
        });
        const response = await fetchPatch(`/servicio/setreview/${idSolicitud}/${idPrestador}`, body, token)
        .then(response => {
            return response;
        })
        console.log(response)
        return response;
    }catch(error){
        throw new Error(error.message);
    }
}

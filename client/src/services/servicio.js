import { fetchGet, fetchPatch } from "../services/fetchIntercept.js";

export const fetchDetalleServicio = async (idSolicitud, idUsuario, token) => {
    try{
        const response = await fetchGet(`/presupuesto/solicitud/${idSolicitud}/prestador/${idUsuario}`, token)
        .then(response => {
            return response;
        })
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};

export const fetchSolicitarTerminacion = async (idSolicitud, idUsuario, token) => {
    try{
        const body = JSON.stringify({estado: "aConfirmar"});
        const response = await fetchPatch(`/servicio/aterminar/${idSolicitud}/prestador/${idUsuario}`, body ,token)
        .then(response => {
            return response;
        })
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};


import { fetchPost } from "../services/fetchIntercept.js";

export const setSolicitud = async (id, data, token ) => {
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const response = await fetchPost(`/solicitud/cliente/${id}`, data, token, headers)
    .then(response => {
        return response;
    })
    return response
};
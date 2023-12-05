import { fetchGet } from "./fetchIntercept";

export const getClientAdresses = async (id, token) => {
    try {
        const response = await fetchGet(`/direccion/cliente/${id}`, token)
        .then(response => {
            return response
        })
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
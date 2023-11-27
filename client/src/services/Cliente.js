import { fetchGet } from "./fetchIntercept";

export const getClientAdresses = async (id, token) => {
    try {
        const adresses = await fetchGet(`/direccion/cliente/${id}`, token)
        .then(response => {
            return response.body.direcciones
        })
        return adresses;
    } catch (error) {
        throw new Error(error.message);
    }
};
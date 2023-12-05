import { fetchGet } from "./fetchIntercept";

export const getExistingProfessions = async (token) => {
    try{
        const response = await fetchGet(`/profesion/getProfesionesExistentes`, token)
        .then(response => {
            return response;
        })
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
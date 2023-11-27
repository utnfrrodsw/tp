import { fetchGet } from "./fetchIntercept";

export const getExistingProfessions = async (token) => {
    try{
        const Professions = await fetchGet(`/profesion/getProfesionesExistentes`, token)
        .then(response => {
            return response.body.profesiones;
        })
        return Professions;
    } catch (error) {
        throw new Error(error.message);
    }
};
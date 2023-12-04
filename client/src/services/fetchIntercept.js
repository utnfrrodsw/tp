import { API_URL } from "../auth/constants";

export const fetchPost = async (url, data, headers) => {
    try{
        const response = await fetch(API_URL + url, {
            method: 'POST',
            headers: headers,
            body: data
        })
        .then(res => res.json())
        .then(response => {
            return response
        });
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};

export const fetchGet = async (url, token,) => {
    try{
        const response = await fetch( API_URL + url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {return data})
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};

export const fetchPut = async (url, data, token) => {
    try{
        const response = await fetch( API_URL + url, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: data
        }).then(res => res.json())
        .then(data => {return data});
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};

export const fetchPatch = async (url, data, token) => {
    try{
        const response = await fetch(API_URL + url, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: data
        })
        .then(res => res.json())
        .then(data => {return data});
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};

export const fetchDelete = async (url, token, body) => {
    try{
        const response = await fetch(API_URL + url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then(res => res.json())
        .then(data => {return data});
        return response;
    }catch(error){
        throw new Error(error.message);
    }
};
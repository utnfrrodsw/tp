export interface AuthResponse{
    body:{
        user: User,
        accessToken: string,
        refreshToken: string
    }
}




export interface User{
    _id: string,
    username:string,
}
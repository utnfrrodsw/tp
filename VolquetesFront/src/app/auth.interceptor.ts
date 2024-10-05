//funcion que intercepta la request: post, get
//se mete antes de la request y agregar un header de localstorage

import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn=(request,next) => {
  const token = localStorage.getItem('token') ?? '';
  request = request.clone({
    setHeaders:{
      Authorization: token?'Token ${token}':'',
    },
  });
  return next(request);
}
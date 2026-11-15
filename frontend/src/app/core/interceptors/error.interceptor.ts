import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP Funcional para manejo centralizado de errores (Requisito Materia.txt).
 * Intercepta todas las respuestas erróneas de la API y las transforma en mensajes amigables en español.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      let userMessage = 'Ocurrió un error inesperado al procesar la solicitud.';

      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          userMessage =
            'No se pudo conectar con el servidor. Verificá tu conexión a internet o que el backend esté en ejecución.';
        } else if (error.status === 400) {
          if (Array.isArray(error.error?.message)) {
            userMessage = error.error.message.join('. ');
          } else {
            userMessage =
              error.error?.message ?? 'Solicitud incorrecta o datos inválidos.';
          }
        } else if (error.status === 401) {
          userMessage =
            'No estás autenticado o tu sesión ha expirado. Por favor, iniciá sesión.';
        } else if (error.status === 403) {
          userMessage =
            'No tenés permisos suficientes para realizar esta acción en el sistema.';
        } else if (error.status === 404) {
          userMessage = 'El recurso solicitado no fue encontrado.';
        } else if (error.status === 500) {
          userMessage =
            'Ocurrió un error interno en el servidor. Por favor, intentá nuevamente más tarde.';
        } else if (
          error.error?.message &&
          typeof error.error.message === 'string'
        ) {
          userMessage = error.error.message;
        }
      }

      return throwError(() => new Error(userMessage));
    })
  );
};

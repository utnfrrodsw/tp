export default function auth(to, from, next) {
  const authToken = localStorage.getItem('token');

  if (!authToken) {
    // Si no hay un token de autenticación, redirige al usuario a la página de inicio de sesión
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    // Si el usuario está autenticado, permite el acceso a la ruta solicitada
    next();
  }
}
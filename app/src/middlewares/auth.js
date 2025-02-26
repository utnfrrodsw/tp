import Vue from 'vue'

export default function auth(to, from, next) {
  const authToken = localStorage.getItem('token')

  const restricted_routes = [
    '/add-group',
    '/edit-group',
    '/add-technician',
    '/edit-technician',
    '/add-task',
    '/edit-task'
  ]

  if (!authToken) {
    Vue.prototype.$isLogged = false
    // Si no hay un token de autenticación, redirige al usuario a la página de inicio de sesión
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    const decoded = JSON.parse(atob(authToken.split('.')[1]))
    const role = decoded.user.role
    Vue.prototype.$isLogged = true
    Vue.prototype.$isAdmin = role === 'admin'
    // Si el usuario está autenticado, permite el acceso a la ruta solicitada
    if (restricted_routes.includes(to.path)) {
      if (role === 'admin') {
        next()
      } else {
        next({ name: 'Home' })
      }
    } else {
      next()
    }
  }
}

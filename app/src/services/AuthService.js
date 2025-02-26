import http from '../http-common'

class AuthService {
  login(data) {
    return http.post(`/auth/login`, data)
  }

  register(data) {
    return http.post(`/auth/register`, data)
  }
}

export default new AuthService()

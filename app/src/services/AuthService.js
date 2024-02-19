import http from '../http-common'

class AuthService {
  login(data) {
    return http.post(`/auth/login`, data)
  }
}

export default new AuthService()

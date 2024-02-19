import http from '../http-common'

class UserService {
  get(id) {
    return http.get(`/users/${id}`)
  }

  update(id, data) {
    return http.put(`/users/${id}`, data)
  }
}

export default new UserService()

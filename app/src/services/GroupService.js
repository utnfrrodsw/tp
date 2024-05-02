import http from '../http-common'

class GroupService {
  getAll(params) {
    return http.get('/groups', { params })
  }

  get(id) {
    return http.get(`/groups/${id}`)
  }

  create(data) {
    return http.post('/groups', data)
  }

  update(id, data) {
    return http.put(`/groups/${id}`, data)
  }

  delete(id) {
    return http.delete(`/groups/${id}`)
  }
}

export default new GroupService()

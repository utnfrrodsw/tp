import http from '../http-common'

class TechnicianService {
  getAll(params) {
    return http.get('/technicians', { params })
  }

  get(id) {
    return http.get(`/technicians/${id}`)
  }

  create(data) {
    return http.post('/technicians', data)
  }

  update(id, data) {
    return http.put(`/technicians/${id}`, data)
  }

  delete(id) {
    return http.delete(`/technicians/${id}`)
  }
}

export default new TechnicianService()

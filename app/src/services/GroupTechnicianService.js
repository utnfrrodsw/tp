import http from '../http-common'

class GroupTechnicianService {
  freeTechnicians() {
    return http.get('/group_technicians')
  }

  getTechnicians(groupId) {
    return http.get(`/group_technicians/${groupId}`)
  }

  create(data) {
    return http.post('/group_technicians', data)
  }

  deleteTechnician(data) {
    return http.put('/group_technicians', data)
  }
}

export default new GroupTechnicianService()

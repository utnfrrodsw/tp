import http from '../http-common'

class GroupTechnicianService {
  freeTechnicians() {
    return http.get('/group_technicians')
  }

  bussyGroups() {
    return http.get('/group_technicians/bussyGroups')
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

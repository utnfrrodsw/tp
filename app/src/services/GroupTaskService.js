import http from '../http-common'

class GroupTaskService {
  get(params) {
    return http.get('/group_tasks', { params })
  }

  create(data) {
    return http.post(`/group_tasks`, data)
  }
}

export default new GroupTaskService()

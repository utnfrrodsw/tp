import http from '../http-common'

class GroupTaskService {
  get(data) {
    return http.get('/group_tasks', data )
  }

  create(data) {
    return http.post(`/group_tasks`,data)
  }
}

export default new GroupTaskService()

import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

import AddGroup from '../views/AddGroup.vue'
import EditGroup from '../views/EditGroup.vue'
import ListGroups from '../views/ListGroups.vue'

import AddTechnician from '../views/AddTechnician.vue'
import EditTechnician from '../views/EditTechnician.vue'
import ListTechnicians from '../views/ListTechnicians.vue'

import AddTask from '../views/AddTask.vue'
import EditTask from '../views/EditTask.vue'
import ListTasks from '../views/ListTasks.vue'

import AddCertification from '../views/AddCertification.vue'
import ListCertifications from '../views/ListCertifications.vue'

import EditUser from '../views/EditUser.vue'
import login from '../views/Login.vue'
import logout from '../views/Logout.vue'
import RegisterOperators from '../views/RegisterOperators.vue'
import auth from '../middlewares/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: auth
  },
  {
    path: '/add-group',
    name: 'AddGroup',
    component: AddGroup,
    beforeEnter: auth
  },
  {
    path: '/edit-group',
    name: 'EditGroup',
    component: EditGroup,
    beforeEnter: auth
  },
  {
    path: '/list-groups',
    name: 'ListGroups',
    component: ListGroups,
    beforeEnter: auth
  },
  {
    path: '/add-technician',
    name: 'AddTechnician',
    component: AddTechnician,
    beforeEnter: auth
  },
  {
    path: '/edit-technician',
    name: 'EditTechnician',
    component: EditTechnician,
    beforeEnter: auth
  },
  {
    path: '/list-technicians',
    name: 'ListTechnicians',
    component: ListTechnicians,
    beforeEnter: auth
  },
  {
    path: '/add-task',
    name: 'AddTask',
    component: AddTask,
    beforeEnter: auth
  },
  {
    path: '/edit-task',
    name: 'EditTask',
    component: EditTask,
    beforeEnter: auth
  },
  {
    path: '/list-tasks',
    name: 'ListTasks',
    component: ListTasks,
    beforeEnter: auth
  },
  {
    path: '/add-certification',
    name: 'AddCertification',
    component: AddCertification,
    beforeEnter: auth
  },
  {
    path: '/list-certifications',
    name: 'ListCertifications',
    component: ListCertifications,
    beforeEnter: auth
  },
  {
    path: '/edit-account',
    name: 'EditUser',
    component: EditUser,
    beforeEnter: auth
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      hideNavbar: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: logout
  },
  {
    path: '/register-operators',
    name: 'register-operators',
    component: RegisterOperators,
    beforeEnter: auth
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

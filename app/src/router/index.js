import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddGroup from '../views/AddGroup.vue'
import ListGroups from '../views/ListGroups.vue'
import ListTechnicians from '../views/ListTechnicians.vue'
import EditTechnician from '../views/EditTechnician.vue'
import AddTechnician from '../views/AddTechnician.vue'
import EditUser from '../views/EditUser.vue'
import login from '../views/Login.vue'
import EditGroup from '../views/EditGroup.vue'
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
    path: '/edit-account',
    name: 'EditUser',
    component: EditUser,
    beforeEnter: auth
  },
  {
    path: '/edit-group',
    name: 'EditGroup',
    component: EditGroup,
    beforeEnter: auth
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      hideNavbar: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

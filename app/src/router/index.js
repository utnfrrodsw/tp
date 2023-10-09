import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddGroup from '../views/AddGroup.vue'
import ListGroups from '../views/ListGroups.vue'
import ListTechnicians from '../views/ListTechnicians.vue'
import EditTechnician from '../views/EditTechnician.vue'
import AddTechnician from '../views/AddTechnician.vue'
import login from '../views/Login.vue'
import auth from '../middlewares/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      middleware: auth
    }
  },
  {
    path: '/add-group',
    name: 'AddGroup',
    component: AddGroup,
    meta: {
      middleware: auth
    }
  },
  {
    path: '/list-groups',
    name: 'ListGroups',
    component: ListGroups,
    meta: {
      middleware: auth
    }
  },
  {
    path: '/add-technician', 
    name: 'AddTechnician',
    component: AddTechnician,
    meta: {
      middleware: auth
    }
  },
  {
    path: '/edit-technician',
    name: 'EditTechnician',
    component: EditTechnician,
    meta: {
      middleware: auth
    }
  },
  {
    path: '/list-technicians',
    name: 'ListTechnicians',
    component: ListTechnicians,
    meta: {
      middleware: auth
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

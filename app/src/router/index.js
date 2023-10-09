import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddGroup from '../views/AddGroup.vue'
import ListGroups from '../views/ListGroups.vue'
import ListTechnicians from '../views/ListTechnicians.vue'
import EditTechnician from '../views/EditTechnician.vue'
import AddTechnician from '../views/AddTechnician.vue'
import login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: { requiresAuth: false }
  },
  {
    path: '/add-group',
    name: 'AddGroup',
    component: AddGroup,
    meta: { requiresAuth: true }
  },
  {
    path: '/list-groups',
    name: 'ListGroups',
    component: ListGroups,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-technician', 
    name: 'AddTechnician',
    component: AddTechnician,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-technician',
    name: 'EditTechnician',
    component: EditTechnician,
    meta: { requiresAuth: true }
  },
  {
      path: '/list-technicians',
      name: 'ListTechnicians',
      component: ListTechnicians,
      meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

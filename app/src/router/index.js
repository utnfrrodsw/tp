import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddGroup from '../views/AddGroup.vue'
import ListGroups from '../views/ListGroups.vue'
import ListTechnicians from '../views/ListTechnicians.vue'
import EditTechnician from '../views/EditTechnician.vue'
import AddTechnician from '../views/AddTechnician.vue'
import AgregarTarea from '../views/AgregarTarea.vue'
import EditarTarea from '../views/EditarTarea.vue'
import ListarTareas from '../views/ListarTareas.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/add-group',
    name: 'AddGroup',
    component: AddGroup
  },
  {
    path: '/list-groups',
    name: 'ListGroups',
    component: ListGroups
  },
  {
    path: '/AgregarTarea',
    name: 'AgregarTarea',
    component: AgregarTarea
  },
  {
    path: '/EditarTarea',
    name: 'EditarTarea',
    component: EditarTarea
  },
  {
    path: '/ListarTareas',
    name: 'ListarRareas',
    component: ListarTareas
  },
  {
    path: '/add-technician', 
    name: 'AddTechnician',
    component: AddTechnician
  },
  {
    path: '/edit-technician',
    name: 'EditTechnician',
    component: EditTechnician
  },
  {
      path: '/list-technicians',
      name: 'ListTechnicians',
      component: ListTechnicians
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

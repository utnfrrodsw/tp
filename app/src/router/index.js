import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import AddGroup from '../views/AddGroup.vue'
import ListGroups from '../views/ListGroups.vue'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import CDHome from '../views/cd-doc-home'
import CDGridView from '../views/cd-doc-grid.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: CDHome
  },
  {
    path: '/Grid',
    name: 'grid',
    component: CDGridView
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

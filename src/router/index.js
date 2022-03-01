import Vue from 'vue'
import VueRouter from 'vue-router'
import CDHome from '../views/cd-doc-home'
import CDGridView from '../views/cd-doc-grid.vue'
import CDFormView from '../views/cd-doc-form.vue'
import CDMenuView from '../views/cd-doc-menu.vue'
import CDListView from '../views/cd-doc-list.vue'
import CDModalView from '../views/cd-doc-modal.vue'
import CDTabView from '../views/cd-doc-tabs.vue'
import CDMonthView from '../views/cd-doc-month.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: CDHome
  },
  {
    path: '/Collection',
    name: 'collection',
    component: CDListView
  },
  {
    path: '/Tabs',
    name: 'tabs',
    component: CDTabView
  },
  {
    path: '/Grid',
    name: 'grid',
    component: CDGridView
  },
  {
    path: '/Calendar',
    name: 'calendar',
    component: CDMonthView
  },
  {
    path: '/Menu',
    name: 'menu',
    component: CDMenuView
  },
  {
    path: '/Form',
    name: 'form',
    component: CDFormView
  },
  {
    path: '/Dialog',
    name: 'dialog',
    component: CDModalView
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

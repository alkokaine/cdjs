import 'bootstrap'
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import ruLocale from 'element-ui/lib/locale/lang/ru-RU'
import router from './router/index'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI, { locale: ruLocale })
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')

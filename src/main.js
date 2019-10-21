// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/css_reset.css'
import './assets/css/el-table.css'
import './assets/css/font.css'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import base from './assets/js/base.js'
import VueQuillEditor from 'vue-quill-editor'
const config = require('../static/config')
Vue.use(ElementUI)
axios.defaults.baseURL = config.baseUrl
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('X-token')
    let userId = localStorage.getItem('X-userId')
    config.headers['token'] = token
    config.headers['userId'] = userId
    return config
  },
  (error) => {
    console.log(error)
  }
)
axios.interceptors.response.use(
  data => {
    return data
  },
  error => {
    // 401代表用户没有权限或者是登录过期
    ElementUI.Message({
      showClose: true,
      message: error.response.data.msg,
      type: 'error'
    })
    router.replace('/login')
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(base)
Vue.use(VueQuillEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/views/login')
const Page = () => import('@/views/page/index.vue')
const index = () => import('@/views/page/index/index.vue')
const peopleManage = () => import('@/views/page/peopleManage')
const eventManage = () => import('@/views/page/eventManage')
const eventRequire = () => import('@/views/page/eventManage/eventRequire')
const eventReport = () => import('@/views/page/eventManage/eventReport')
const liveServer = () => import('@/views/page/liveServer')
const newsManage = () => import('@/views/page/newsManage')
const newsAdd = () => import('@/views/page/newsManage/add')
const newsType = () => import('@/views/page/newsManage/newsType')
const newsComments = () => import('@/views/page/newsManage/comments')
// const config = () => import('@/views/page/config')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      name: 'page',
      path: '/page',
      component: Page,
      redirect: {
        name: 'index'
      },
      children: [
        {
          path: 'index',
          name: 'index',
          component: index
        },
        {
          path: 'peopleManage',
          name: 'peopleManage',
          component: peopleManage
        },
        {
          path: 'eventManage',
          name: 'eventManage',
          component: eventManage
        },
        {
          path: 'eventRequire',
          name: 'eventRequire',
          component: eventRequire
        },
        {
          path: 'eventReport',
          name: 'eventReport',
          component: eventReport
        },
        {
          path: 'liveServer',
          name: 'liveServer',
          component: liveServer
        },
        {
          path: 'newsManage',
          name: 'newsManage',
          component: newsManage
        },
        {
          path: 'newsAdd/:data',
          name: 'newsAdd',
          component: newsAdd
        },
        {
          path: 'newsType',
          name: 'newsType',
          component: newsType
        },
        {
          path: 'newsComments',
          name: 'newsComments',
          component: newsComments
        }
        // {
        //   path: 'config',
        //   name: 'config',
        //   component: config
        // }
      ]
    },
    {
      path: '*',
      name: 'error',
      redirect: {
        name: 'login'
      }
    }
  ]
})

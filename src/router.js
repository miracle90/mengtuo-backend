import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Index from './views/Index.vue'
import Welcome from './views/Welcome.vue'
import Account from './views/Account.vue'
import Course from './views/Course.vue'
import User from './views/User.vue'
import Goods from './views/Goods.vue'
import Exchange from './views/Exchange.vue'

Vue.use(Router)

export default new Router({
  base: 'manage',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      // name: 'index',
      component: Index,
      children: [
        {
          path: '',
          name: 'welcome',
          component: Welcome
        },
        {
          path: '/user',
          name: 'user',
          component: User
        },
        {
          path: '/course',
          name: 'course',
          component: Course
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/exchange',
          name: 'exchange',
          component: Exchange
        },
        {
          path: '/account',
          name: 'account',
          component: Account
        }
      ]
    }
  ]
})

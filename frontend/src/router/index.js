import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LoginPage from '@/components/member/LoginPage'
import SignupPage from '@/components/member/SignupPage'
import MonitoringPage from '@/components/main/MonitoringPage'
import StaticEquipmentPage from '@/components/statistics/StaticEquipmentPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
/*    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },*/
    /*About Login Process*/
    {
      path: '/',
      redirect: '/login',
      component: LoginPage,
      children: [{
        path:'/login',
        name: 'LoginPage',
        component: LoginPage
      }]
    },
/*    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },*/
    {
      path: '/signup',
      name: 'SignupPage',
      component: SignupPage
    },
    /************************/
    {
      path: '/monitoring',
      name: 'MonitoringPage',
      component: MonitoringPage,
      props: true
    },
    {
      path: '/static',
      name: 'StaticEquipmentPage',
      component: StaticEquipmentPage,
      props: true
    },
  ]
})

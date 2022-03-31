import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LoginPage from '@/components/member/LoginPage'
import SignupPage from '@/components/member/SignupPage'
import MonitoringPage from '@/components/main/MonitoringPage'
import StaticEquipmentPage from '@/components/statistics/StaticEquipmentPage'

Vue.use(Router)

const router = new Router({
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
      meta: {requiresAuth: false},
      children: [{
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
      }],
    },
    /*    {
          path: '/login',
          name: 'LoginPage',
          component: LoginPage
        },*/
    {
      path: '/signup',
      name: 'SignupPage',
      component: SignupPage,
      meta: {requiresAuth: false}
    },
    /************************/
    {
      path: '/monitoring',
      name: 'MonitoringPage',
      component: MonitoringPage,
      meta: {requiresAuth: true}
    },
    {
      path: '/static',
      name: 'StaticEquipmentPage',
      component: StaticEquipmentPage,
      meta: {requiresAuth: true}
    },
  ]
})

/*네비게이션 가드 설정, 전역 설정으로 항상 동작 함.*/
router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('vuex');

    //토큰이 있으면 로그인이 된거임. 즉 로그인 페이지로 이동을 못함.
    //로그인됨.
    if (loggedIn != null) {
      if (JSON.parse(loggedIn).user.isLogin) {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          next();
        } else {
          alert("비정상적인 접근입니다. 악취 페이지로 이동합니다.")
          next('/monitoring');
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }
)

export default router;

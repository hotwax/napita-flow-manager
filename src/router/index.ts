import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Settings from "@/views/Settings.vue"
import { useUserStore } from '@/store/user';
import { showToast } from '@/utils'
import 'vue-router'
import { useAuthStore, translate } from '@hotwax/dxp-components'
import Login from "@/views/Login.vue"
import { computed } from 'vue';

// Defining types for the meta values
declare module 'vue-router' {
  interface RouteMeta {
    permissionId?: string;
  }
}

// const authGuard = async (to: any, from: any, next: any) => {
//   const authStore = useAuthStore()
//   if (!authStore.isAuthenticated || !store.getters['user/isAuthenticated']) {
//     await loader.present('Authenticating')
//     // TODO use authenticate() when support is there
//     const redirectUrl = window.location.origin + '/login'
//     window.location.href = `${process.env.VUE_APP_LOGIN_URL}?redirectUrl=${redirectUrl}`
//     loader.dismiss()
//   }
//   next()
// };

// const loginGuard = (to: any, from: any, next: any) => {
//   const authStore = useAuthStore()
//   if (authStore.isAuthenticated && !to.query?.token && !to.query?.oms) {
//     next('/')
//   }
//   next();
// };
// const authGuard = (to: any, from: any, next: any) => {
//   if (store.getters["user/isAuthenticated"]) {
//     next()
//   } else {
//     next("/login")
//   }
// };

const loginGuard = (to: any, from: any, next: any) => {
  console.log("oming here or not");
  
  const userStore = useUserStore()
  if (!userStore.isAuthenticated) {
    next()
  } else {
    next("/")
  }
};
const authGuard = (to: any, from: any, next: any) => {
  console.info('======================================')
  const userStore = useUserStore()
  
  const isAuthenticated = computed(() => userStore.isAuthenticated)
  console.log(isAuthenticated);
  
  if (userStore.isAuthenticated) {
    next()
  } else {
    next("/login")
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/settings'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loginGuard

  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    beforeEnter: authGuard
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   authGuard(to, from, next); 
// });

export default router

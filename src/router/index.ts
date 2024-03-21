import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Settings from "@/views/Settings.vue"
import store from '@/store'
import { hasPermission } from '@/authorization';
import { showToast } from '@/utils'
import 'vue-router'
import { useAuthStore, translate } from '@hotwax/dxp-components'
import { loader, login } from '@/utils/user';
import Login from "@/views/Login.vue"

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

const loginGuard = (to: any, from: any, next: any) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated && !to.query?.token && !to.query?.oms) {
    next('/')
  }
  next();
};
// const loginGuard = () => {

// }
const authGuard = (to: any, from: any, next: any) => {
  if (store.getters["user/isAuthenticated"]) {
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  if (to.meta.permissionId && !hasPermission(to.meta.permissionId)) {
    let redirectToPath = from.path;
    // If the user has navigated from Login page or if it is page load, redirect user to settings page without showing any toast
    if (redirectToPath == "/login" || redirectToPath == "/") redirectToPath = "/settings";
    else showToast(translate('You do not have permission to access this page'));
    return {
      path: redirectToPath,
    }
  }
})

export default router
